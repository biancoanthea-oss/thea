import type { Metadata } from "next";
import Link from "next/link";
import { formatPublishedDate, getAllPosts, readingMinutes } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, interviews and advice from the team.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        <header className="border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 text-lg">
            Insights, interviews and advice from the team.
          </p>
        </header>

        <ul className="mt-8 divide-y divide-slate-200">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              {post.series && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">
                  {post.series}
                </p>
              )}
              <h2 className="mt-2 text-2xl font-semibold leading-snug text-slate-900">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-sage-dark"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed">{post.excerpt}</p>
              <p className="mt-4 text-sm text-slate-500">
                {post.author.name}
                <span aria-hidden> · </span>
                <time dateTime={post.publishedAt}>
                  {formatPublishedDate(post.publishedAt)}
                </time>
                <span aria-hidden> · </span>
                {readingMinutes(post)} min read
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
