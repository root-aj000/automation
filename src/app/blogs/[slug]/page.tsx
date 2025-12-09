import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import ScrollProgressBar from "@/component/scroll";
import { getBlogBySlug, getAllBlogSlugs } from "@/utils/BlogPage";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  if (!result) {
    return {
      title: "Blog Not Found",
    };
  }

  const { data: blog } = result;

  return {
    title: blog.title,
    description: blog.excerpt || `Read ${blog.title} by ${blog.author}`,
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} by ${blog.author}`,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
      images: blog.image ? [{ url: blog.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || `Read ${blog.title} by ${blog.author}`,
      images: blog.image ? [blog.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch from GitHub
  const result = await getBlogBySlug(slug);

  if (!result) {
    return notFound();
  }

  const { data: blog, content } = result;

  return (
    <>
      <ScrollProgressBar />

      <article className="bg-background py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {blog.author?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm text-muted">
                  By <span className="font-medium text-foreground">{blog.author}</span>
                </span>
              </div>
              <span className="text-sm text-primary font-medium">
                {new Date(blog.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-primary prose-strong:text-foreground">
            <MDXRemote source={content} />
          </div>

          {/* Footer divider */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-primary to-primary/50 rounded-full" />
          </div>
        </div>
      </article>
    </>
  );
}
