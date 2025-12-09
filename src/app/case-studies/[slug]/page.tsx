import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import ScrollProgressBar from "@/component/scroll";
import { getCaseBySlug, getAllCaseSlugs } from "@/utils/CasePage";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCaseBySlug(slug);

  if (!result) {
    return {
      title: "Case Study Not Found",
    };
  }

  const { data: caseStudy } = result;

  return {
    title: caseStudy.title,
    description: caseStudy.excerpt || `Case Study: ${caseStudy.title}`,
    authors: [{ name: caseStudy.author }],
    openGraph: {
      title: `${caseStudy.title} | Case Study`,
      description: caseStudy.excerpt || `Case Study: ${caseStudy.title}`,
      type: "article",
      publishedTime: caseStudy.date,
      authors: [caseStudy.author],
      images: caseStudy.image ? [{ url: caseStudy.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${caseStudy.title} | Case Study`,
      description: caseStudy.excerpt || `Case Study: ${caseStudy.title}`,
      images: caseStudy.image ? [caseStudy.image] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;

  // Fetch from GitHub
  const result = await getCaseBySlug(slug);

  if (!result) {
    return notFound();
  }

  const { data: caseStudy, content } = result;

  return (
    <>
      <ScrollProgressBar />
      <article className="bg-background py-8 lg:py-12">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              Case Study
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              {caseStudy.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {caseStudy.author?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm text-muted">
                  By <span className="font-medium text-foreground">{caseStudy.author}</span>
                </span>
              </div>
              <span className="text-sm text-primary font-medium">
                {caseStudy.date}
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
