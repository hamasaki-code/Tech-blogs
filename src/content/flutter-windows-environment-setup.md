---
title: "WindowsでFlutterの環境構築を行う手順"
date: "2026-02-14"
tags: ["Flutter"]
---

# WindowsでFlutterの環境構築を行う手順

FlutterでAndroidアプリを開発するための
**Windows環境構築手順**をまとめました。

この記事では：

* Flutter SDKの導入
* 環境変数の設定
* Android Studioの設定
* `flutter doctor` を通す
* プロジェクト作成・起動確認

までを行います。


## 0. 前提環境

* Windows 10 / 11（64bit）
* 管理者権限あり
* 空き容量 10GB以上推奨


## 1. Gitのインストール

まずはGitをインストールします。

インストール後、PowerShellで確認：

```powershell
git --version
```

バージョンが表示されればOK。


## 2. Flutter SDKのインストール

### 2-1. Flutter SDKをダウンロード

Flutter公式サイトから
**Windows版ZIP**をダウンロードします。

https://docs.flutter.dev/install/manual

> ⚠ OneDrive配下は避けるのがおすすめ


### 2-2. 環境変数（PATH）の設定

#### 重要ポイント

追加するのは **binフォルダまで**。

```
C:\src\flutter\bin
```


#### 設定手順

1. Windowsキー → 「環境変数」と検索
2. 「システム環境変数の編集」を開く
3. 「環境変数(N)...」をクリック
4. 「ユーザー環境変数」内の **Path** を選択
5. 「編集」をクリック
6. 「新規」をクリック
7. 以下を追加：

```
C:\src\flutter\bin
```

7. OKで閉じる
8. PowerShellを再起動


### 2-3. 動作確認

```powershell
flutter --version
```

バージョンが表示されれば成功。


## 3. Android Studioのインストール

FlutterでAndroid開発するために必須です。

### 3-1. インストール

Android Studioをインストールし、初期ウィザードでSDKを入れる。

https://developer.android.com/studio?hl=ja


### 3-2. SDK設定確認

Android Studio →
**File → Settings → Android SDK**

#### SDK Toolsタブで以下にチェック

* ✅ Android SDK Command-line Tools (latest)
* ✅ Android SDK Platform-Tools
* ✅ Android SDK Build-Tools
* ✅ Android Emulator

Apply → OK


## 4. flutter doctor を通す

PowerShellで：

```powershell
flutter doctor
```

必要に応じて：

```powershell
flutter doctor --android-licenses
```

全部 `y` で同意。


### 理想状態

```
[✓] Flutter
[✓] Android toolchain
[✓] Android Studio
[✓] Connected device
• No issues found!
```

## 5. Androidエミュレータ作成

Android Studio → Device Manager →
仮想デバイスを作成。

起動後：

```powershell
flutter devices
```

Androidが表示されればOK。


## 6. Flutterプロジェクト作成

⚠ Flutter SDKフォルダの中では作らない

推奨構成：

```
C:\src
 ├─ flutter         ← SDK
 ├─ flutter_projects
 │    └─ flutter_test  ← アプリ
```


### 作成手順

```powershell
mkdir flutter_projects
cd flutter_projects

flutter create flutter_test
cd flutter_test
```


## 7. Androidで起動確認

```powershell
flutter run
```

Androidエミュレータを選択。

デモアプリが起動すれば成功。


## 8. よくあるエラー対処

### cmdline-toolsが無い

Android Studio → SDK Tools
→ Android SDK Command-line Tools (latest) をインストール


### flutter コマンドが認識されない

PATHに

```
C:\src\flutter\bin
```

が入っているか確認。


### Webで起動してすぐ終了する

`flutter run` で Chrome を選んでいる可能性あり。
Androidを選択して起動する。


## まとめ

WindowsでFlutterのAndroid開発環境を構築する流れ：

1. Gitインストール
2. Flutter SDK導入
3. PATH設定
4. Android Studio導入
5. flutter doctor を通す
6. エミュレータ作成
7. flutter run で確認


