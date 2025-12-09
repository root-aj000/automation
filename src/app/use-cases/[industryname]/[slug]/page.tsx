import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UsecaseProps } from "@/types/define_props";
import { MDXRemote } from "next-mdx-remote/rsc";
import ScrollProgressBar from "@/component/scroll";
import UseCaseHero from "@/component/use_case_hero";
import ChallengesSection from "@/component/challenges_section";
import BenefitsSection from "@/component/benefits_section";
import ResultsSection from "@/component/results_section";
import TestimonialSection from "@/component/testimonial_section";
import { CONTENT_CONFIG } from "@/config/content.config";
import { listDirectory, fetchMdxWithFrontmatter } from "@/services/github-content";

type Props = {
  params: { industryname: string; slug: string };
};

// Helper to find the actual filename (case-insensitive match)
async function findUseCaseFile(industryname: string, slug: string): Promise<{ industry: string; filename: string } | null> {
  try {
    const directories = await listDirectory(CONTENT_CONFIG.paths.useCases);
    const targetIndustry = industryname.toLowerCase();

    const matchingDir = directories.find(
      (dir) => dir.type === "dir" && dir.name.toLowerCase() === targetIndustry
    );

    if (!matchingDir) return null;

    const files = await listDirectory(`${CONTENT_CONFIG.paths.useCases}/${matchingDir.name}`);
    const targetSlug = slug.toLowerCase();

    const matchingFile = files.find(
      (file) =>
        file.type === "file" &&
        file.name.endsWith(".mdx") &&
        file.name.replace(".mdx", "").toLowerCase() === targetSlug
    );

    return matchingFile ? { industry: matchingDir.name, filename: matchingFile.name } : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const directories = await listDirectory(CONTENT_CONFIG.paths.useCases);
    const params: { industryname: string; slug: string }[] = [];

    for (const dir of directories.filter((d) => d.type === "dir")) {
      const files = await listDirectory(`${CONTENT_CONFIG.paths.useCases}/${dir.name}`);
      for (const file of files.filter((f) => f.type === "file" && f.name.endsWith(".mdx"))) {
        params.push({
          industryname: dir.name.toLowerCase(),
          slug: file.name.replace(".mdx", "").toLowerCase(),
        });
      }
    }

    return params;
  } catch (error) {
    console.error("Failed to generate use case params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industryname, slug } = await params;

  try {
    const match = await findUseCaseFile(industryname, slug);
    if (!match) {
      return { title: "Use Case Not Found" };
    }

    const { data } = await fetchMdxWithFrontmatter<UsecaseProps>(
      `${CONTENT_CONFIG.paths.useCases}/${match.industry}/${match.filename}`
    );
    const usecase = data.usecase;

    return {
      title: usecase?.title || "Use Case",
      description: usecase?.description || "Use case details",
      openGraph: {
        title: usecase?.title,
        description: usecase?.description,
        images: usecase?.hero_image ? [{ url: usecase.hero_image }] : undefined,
      },
    };
  } catch {
    return {
      title: "Use Case Not Found",
    };
  }
}

export default async function UseCasePage({ params }: Props) {
  const { industryname, slug } = await params;

  try {
    const match = await findUseCaseFile(industryname, slug);

    if (!match) {
      return notFound();
    }

    const { data, content } = await fetchMdxWithFrontmatter<UsecaseProps>(
      `${CONTENT_CONFIG.paths.useCases}/${match.industry}/${match.filename}`
    );
    const usecase = data.usecase;

    if (!usecase) {
      return notFound();
    }

    const displayIndustry = match.industry.charAt(0).toUpperCase() + match.industry.slice(1).replace(/-/g, ' ');

    return (
      <>
        <ScrollProgressBar />

        {/* Hero Section */}
        <UseCaseHero
          title={usecase.title}
          description={usecase.description}
          hero_image={usecase.hero_image}
          industry={usecase.industry || displayIndustry}
          tagline={usecase.tagline}
        />

        {/* Challenges Section */}
        <ChallengesSection
          challenges={usecase.challenges}
          title="The Challenges You Face"
          subtitle="Common pain points that slow down your business"
        />

        {/* Benefits/Solution Section */}
        <BenefitsSection
          benefits={usecase.benefits}
          title="How We Solve It"
          subtitle="Transform your workflow with our automation solution"
        />

        {/* Results Section */}
        <ResultsSection
          results={usecase.results}
          title="Real Results"
          subtitle="Proven outcomes from organizations like yours"
        />

        {/* Testimonial Section */}
        {usecase.testimonial && (
          <TestimonialSection testimonial={usecase.testimonial} />
        )}

        {/* MDX Content (if any) */}
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
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {usecase.cta?.title || `Ready to transform your ${displayIndustry.toLowerCase()}?`}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {usecase.cta?.description || "Join leading organizations already using our platform to automate and scale."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="group px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                {usecase.cta?.primary_button || "Start Free Trial"}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#"
                className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {usecase.cta?.secondary_button || "Schedule a Demo"}
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.error("Failed to fetch use case:", error);
    return notFound();
  }
}
