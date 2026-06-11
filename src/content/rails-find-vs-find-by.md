---
title: "Railsのfindとfind_byの違い"
date: "2026-06-11"
tags: ["Rails", "Ruby", "ActiveRecord"]
excerpt: "Ruby on RailsのActiveRecordでよく使うfindとfind_byの違いを、戻り値、例外、検索条件、実務での使い分けまで整理します。"
---

# Railsのfindとfind_byの違い

Railsでデータベースから1件のレコードを取得するとき、よく出てくるのが `find` と `find_by` です。

どちらも「1件取得する」ためのメソッドですが、目的はかなり違います。
結論から言うと、次のように覚えると整理しやすいです。

| メソッド | 何で探すか | 見つからないとき | 主な用途 |
| --- | --- | --- | --- |
| `find` | 主キー、通常は `id` | 例外 `ActiveRecord::RecordNotFound` | URLの `id` から詳細ページを表示する |
| `find_by` | 任意のカラム条件 | `nil` | メールアドレス、名前、状態など条件で探す |

## まず結論

`find` は、主キーで探すためのメソッドです。

```ruby
User.find(1)
```

これは「`users` テーブルから `id = 1` のユーザーを探す」という意味です。
見つからない場合は `nil` ではなく、例外が発生します。

一方、`find_by` は任意の条件で1件探すためのメソッドです。

```ruby
User.find_by(email: "taro@example.com")
```

これは「`email` が `taro@example.com` のユーザーを1件探す」という意味です。
見つからない場合は `nil` が返ります。

## findとは

`find` は、ActiveRecordの主キーでレコードを検索します。
Railsでは多くの場合、主キーは `id` です。

```ruby
user = User.find(1)
```

イメージとしては、次のSQLに近い処理です。

```sql
SELECT "users".*
FROM "users"
WHERE "users"."id" = 1
LIMIT 1;
```

### findの特徴

| 観点 | 内容 |
| --- | --- |
| 検索対象 | 主キー、通常は `id` |
| 戻り値 | 見つかったモデルオブジェクト |
| 見つからない場合 | `ActiveRecord::RecordNotFound` が発生 |
| 複数ID指定 | 可能。ただし足りないIDがあると例外 |
| よく使う場面 | 詳細ページ、編集ページ、削除処理 |

例えば、Controllerではよく次のように使います。

```ruby
class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
  end
end
```

`/users/1` にアクセスしたら `id = 1` のユーザーを取得します。
存在しないIDなら `ActiveRecord::RecordNotFound` が発生し、Railsの通常の流れでは404 Not Foundとして扱いやすくなります。

## find_byとは

`find_by` は、指定した条件に一致するレコードを1件取得します。
`id` 以外のカラムでも検索できます。

```ruby
user = User.find_by(email: "taro@example.com")
```

イメージとしては、次のSQLに近い処理です。

```sql
SELECT "users".*
FROM "users"
WHERE "users"."email" = 'taro@example.com'
LIMIT 1;
```

複数条件も指定できます。

```ruby
user = User.find_by(email: "taro@example.com", active: true)
```

これは「メールアドレスが一致し、かつ有効なユーザーを1件取得する」という意味です。

### find_byの特徴

| 観点 | 内容 |
| --- | --- |
| 検索対象 | 任意のカラム |
| 戻り値 | 見つかったモデルオブジェクト、または `nil` |
| 見つからない場合 | `nil` |
| 複数条件指定 | 可能 |
| よく使う場面 | ログイン、検索、任意条件での取得 |

見つからない可能性を自然に扱いたい場合は、`find_by` が向いています。

```ruby
user = User.find_by(email: params[:email])

if user
  # ユーザーが見つかった場合
else
  # ユーザーが見つからなかった場合
end
```

## 処理の流れを図で見る

次の図を見ると、`find` と `find_by` の一番大きな違いがわかりやすくなります。
違いは「見つからなかったときに、例外になるか `nil` になるか」です。

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:24px 0;">
  <div style="border:1px solid #cbd5e1;background:#f8fafc;padding:16px;">
    <div style="font-weight:700;font-size:18px;margin-bottom:12px;">find(id)</div>
    <div style="border:1px solid #94a3b8;background:white;padding:10px;text-align:center;">主キー id で検索</div>
    <div style="text-align:center;margin:8px 0;">↓</div>
    <div style="display:grid;gap:8px;">
      <div style="border-left:4px solid #16a34a;background:white;padding:10px;">見つかった → モデルを返す</div>
      <div style="border-left:4px solid #dc2626;background:white;padding:10px;">見つからない → <code>ActiveRecord::RecordNotFound</code></div>
    </div>
  </div>
  <div style="border:1px solid #cbd5e1;background:#f8fafc;padding:16px;">
    <div style="font-weight:700;font-size:18px;margin-bottom:12px;">find_by(条件)</div>
    <div style="border:1px solid #94a3b8;background:white;padding:10px;text-align:center;">指定した条件で検索</div>
    <div style="text-align:center;margin:8px 0;">↓</div>
    <div style="display:grid;gap:8px;">
      <div style="border-left:4px solid #16a34a;background:white;padding:10px;">見つかった → モデルを返す</div>
      <div style="border-left:4px solid #2563eb;background:white;padding:10px;">見つからない → <code>nil</code></div>
    </div>
  </div>
</div>

この「例外になるか、`nil` になるか」は、実装時の分岐やエラーハンドリングに直結します。

## 実例で比較する

次のような `users` テーブルがあるとします。

| id | name | email | active |
| --- | --- | --- | --- |
| 1 | Taro | taro@example.com | true |
| 2 | Hanako | hanako@example.com | false |

### findの例

```ruby
User.find(1)
# => #<User id: 1, name: "Taro", email: "taro@example.com", active: true>
```

```ruby
User.find(999)
# => ActiveRecord::RecordNotFound
```

`find` は「そのIDのデータは存在するはず」という前提で使うことが多いです。

### find_byの例

```ruby
User.find_by(email: "taro@example.com")
# => #<User id: 1, name: "Taro", email: "taro@example.com", active: true>
```

```ruby
User.find_by(email: "missing@example.com")
# => nil
```

`find_by` は「条件に合うデータがあるかもしれないし、ないかもしれない」という場面に向いています。

## find_by! もある

`find_by` と似たメソッドに `find_by!` があります。

```ruby
User.find_by!(email: "missing@example.com")
```

`find_by!` は、条件に一致するレコードが見つからない場合に `ActiveRecord::RecordNotFound` を発生させます。

| メソッド | 見つからないとき |
| --- | --- |
| `find` | 例外 |
| `find_by` | `nil` |
| `find_by!` | 例外 |

つまり、`find_by!` は「`id` 以外の条件で探したいが、見つからない場合は例外にしたい」ときに使います。

```ruby
current_user.account.find_by!(slug: params[:account_slug])
```

このように、URLに含まれる `slug` などで検索し、存在しなければ404にしたい場面で便利です。

## 実務での使い分け

### 詳細ページではfindを使うことが多い

```ruby
def show
  @article = Article.find(params[:id])
end
```

URLの `id` で詳細ページを表示する場面では、対象が存在しなければ404にしたいことが多いです。
そのため `find` が自然です。

### ログイン処理ではfind_byを使うことが多い

```ruby
user = User.find_by(email: params[:email])

if user&.authenticate(params[:password])
  session[:user_id] = user.id
else
  flash.now[:alert] = "メールアドレスまたはパスワードが違います"
  render :new, status: :unprocessable_entity
end
```

ログインでは、入力されたメールアドレスのユーザーが存在しないことは普通にあります。
この場合、例外よりも `nil` として扱える `find_by` が向いています。

### 条件に一致する最新データを取りたいならorderを付ける

`find_by` は「条件に一致する1件」を返しますが、並び順を指定しない場合、どの1件が返るかをビジネスロジックとして期待してはいけません。

例えば「公開済みの記事の中で最新のもの」を取りたいなら、次のように書きます。

```ruby
Article
  .where(published: true)
  .order(published_at: :desc)
  .first
```

または、条件を絞った上で `find_by` を使います。

```ruby
Article
  .order(published_at: :desc)
  .find_by(published: true)
```

「最新」「最古」「優先度順」などの意味がある場合は、必ず `order` を明示しましょう。

## よくある間違い

### findにid以外の条件を渡そうとする

これは間違いです。

```ruby
User.find(email: "taro@example.com")
```

`find` は主キー検索用です。
メールアドレスで探したいなら、次のように書きます。

```ruby
User.find_by(email: "taro@example.com")
```

### find_byの結果がnilになる可能性を忘れる

`find_by` は見つからないと `nil` を返します。
そのため、次のコードはエラーになる可能性があります。

```ruby
user = User.find_by(email: params[:email])
user.name
```

ユーザーが存在しない場合、`user` は `nil` なので `NoMethodError` になります。

対策として、存在確認を入れます。

```ruby
user = User.find_by(email: params[:email])

if user
  user.name
else
  "ユーザーが見つかりません"
end
```

または、安全に呼び出すだけなら `&.` を使えます。

```ruby
user = User.find_by(email: params[:email])
user&.name
```

ただし、`&.` を使いすぎると「本来存在すべきデータがない」というバグを見逃すことがあります。
存在しないことが異常なら、`find` や `find_by!` で例外にした方が適切です。

## パフォーマンスの考え方

`find` は主キー検索なので、通常は主キーインデックスが使われます。
そのため高速です。

`find_by` も、検索対象のカラムにインデックスがあれば高速に検索できます。
例えばログインでメールアドレス検索をするなら、`email` にユニークインデックスを付けるのが一般的です。

```ruby
add_index :users, :email, unique: true
```

重要なのは、`find_by` 自体が遅いのではなく、検索条件に使うカラムへ適切なインデックスがあるかどうかです。

## 説明するときの要点

短く整理するなら、次のように言えます。

> `find` は主キーでレコードを取得するメソッドで、見つからない場合は `ActiveRecord::RecordNotFound` を発生させます。`find_by` は任意のカラム条件で1件取得するメソッドで、見つからない場合は `nil` を返します。詳細ページのように存在しなければ404にしたい場合は `find`、ログインや検索のように存在しないことが通常の分岐である場合は `find_by` を使います。

もう少し踏み込むなら、次の点も押さえておくと理解が深まります。

- `find_by!` を使うと、`id` 以外の条件でも見つからない場合に例外を発生させられる
- `find_by` は条件に一致する最初の1件を返すが、順序が重要なら `order` を明示する
- `find_by` でよく検索するカラムにはインデックス、必要ならユニークインデックスを張る
- `find_by` は `nil` の可能性があるので、その後の処理で存在チェックが必要

## まとめ

| 比較項目 | find | find_by |
| --- | --- | --- |
| 探し方 | 主キーで探す | 任意の条件で探す |
| 例 | `User.find(1)` | `User.find_by(email: "...")` |
| 見つからない場合 | 例外 | `nil` |
| 使う場面 | 詳細、編集、削除などID指定の処理 | ログイン、検索、条件付き取得 |
| 注意点 | 存在しないIDなら例外 | `nil` チェックが必要 |

`find` と `find_by` の違いは、Railsの基礎でありながら実務でもよく出ます。

判断基準はシンプルです。

- `id` で探し、なければ404や例外にしたいなら `find`
- 条件で探し、なければ通常の分岐として扱いたいなら `find_by`
- 条件で探し、なければ例外にしたいなら `find_by!`

この3つを押さえておけば、実装中にどのメソッドを使うべきか判断しやすくなります。
