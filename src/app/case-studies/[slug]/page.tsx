import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import ScrollProgressBar from "@/component/scroll";
import { getCaseBySlug, getAllCaseSlugs } from "@/utils/CasePage";
import { notFound } from "next/navigation";
import UseCaseHero from "@/component/use_case_hero";
import ChallengesSection from "@/component/challenges_section";
import BenefitsSection from "@/component/benefits_section";
import ResultsSection from "@/component/results_section";
import TestimonialSection from "@/component/testimonial_section";

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

      {/* Hero Section */}
      <UseCaseHero
        title={caseStudy.title}
        description={caseStudy.excerpt || caseStudy.title}
        hero_image={caseStudy.hero_image || caseStudy.image}
        industry={caseStudy.category || "Case Study"}
        tagline={caseStudy.tagline || "Success Story"}
      />

      {/* Challenges Section */}
      {caseStudy.challenges && (
        <ChallengesSection
          challenges={caseStudy.challenges}
          title="The Challenge"
          subtitle="Obstacles that were standing in the way"
        />
      )}

      {/* Solution Section (using Benefits component) */}
      {caseStudy.solution && (
        <BenefitsSection
          benefits={caseStudy.solution}
          title="The Solution"
          subtitle="How we addressed the challenges"
        />
      )}

      {/* Results Section */}
      {caseStudy.results && (
        <ResultsSection
          results={caseStudy.results}
          title="Key Results"
          subtitle="Measurable impact and outcomes"
        />
      )}

      {/* Testimonial Section */}
      {caseStudy.testimonial && (
        <TestimonialSection testimonial={caseStudy.testimonial} />
      )}

      {/* MDX Content */}
      {content && content.trim() && (
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-primary prose-strong:text-foreground">
              <MDXRemote source={content} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {caseStudy.cta && (
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {caseStudy.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {caseStudy.cta.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="group px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                {caseStudy.cta.primary_button}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              {caseStudy.cta.secondary_button && (
                <a
                  href="#"
                  className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  {caseStudy.cta.secondary_button}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
