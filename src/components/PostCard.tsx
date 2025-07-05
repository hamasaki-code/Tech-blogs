import Link from "next/link";

type Props = {
    slug: string;
    title: string;
    date: string;
};

export default function PostCard({ slug, title, date }: Props) {
    return (
        <div className="border p-4 rounded mb-4 hover:shadow">
        <Link href={`/blog/${slug}`}>
            <h2 className="text-xl font-bold text-blue-600">{title}</h2>
            <p className="text-sm text-gray-500">{date}</p>
        </Link>
        </div>
    );
}
