import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import {
  formatPublishedDate,
  getAllPosts,
  getPostBySlug,
  readingMinutes,
} from "@/lib/blog";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
  };

  return (
    <div className="min-h-screen bg-white text-slate-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        <Link
          href="/blog"
          className="text-sm font-medium text-sage transition-colors hover:text-sage-dark"
        >
          ← All articles
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          {post.series && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">
              {post.series}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-semibold text-white"
            >
              {post.author.initials}
            </span>
            <div className="text-sm">
              <p className="font-semibold text-slate-900">{post.author.name}</p>
              <p className="text-slate-500">{post.author.role}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            <time dateTime={post.publishedAt}>
              {formatPublishedDate(post.publishedAt)}
            </time>
            <span aria-hidden> · </span>
            {readingMinutes(post)} min read
          </p>
        </header>

        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          {post.intro.map((paragraph, i) => (
            <p key={i}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {post.questions.map((qa) => (
            <section key={qa.question}>
              <h2 className="border-l-4 border-blush pl-4 text-xl font-semibold leading-snug text-slate-900">
                {qa.question}
              </h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed">
                {qa.answer.map((paragraph, i) => (
                  <p key={i}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-14 rounded-3xl bg-cream p-7 ring-1 ring-sage/15 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-900">
            {post.callToAction.heading}
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed">
            {post.callToAction.body.map((paragraph, i) => (
              <p key={i}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          <a
            href={post.callToAction.href}
            className="mt-6 inline-block rounded-full bg-sage px-6 py-3 font-medium text-white transition-colors hover:bg-sage-dark"
          >
            {post.callToAction.linkLabel}
          </a>
        </aside>
      </article>
    </div>
  );
}
