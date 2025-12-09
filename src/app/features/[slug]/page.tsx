import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureProps } from "@/types/define_props";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CONTENT_CONFIG } from "@/config/content.config";
import { fetchMdxWithFrontmatter, listDirectory } from "@/services/github-content";
import Image from "next/image";

type Props = {
  params: { slug: string };
};

// Helper to find the actual filename (case-insensitive match)
async function findFeatureFile(slug: string): Promise<string | null> {
  try {
    const files = await listDirectory(CONTENT_CONFIG.paths.featureItems);
    const targetSlug = slug.toLowerCase();

    const matchingFile = files.find(
      (file) =>
        file.type === "file" &&
        file.name.endsWith(".mdx") &&
        file.name.replace(".mdx", "").toLowerCase() === targetSlug
    );

    return matchingFile ? matchingFile.name : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const files = await listDirectory(CONTENT_CONFIG.paths.featureItems);
    return files
      .filter((file) => file.type === "file" && file.name.endsWith(".mdx"))
      .map((file) => ({
        slug: file.name.replace(".mdx", "").toLowerCase(),
      }));
  } catch (error) {
    console.error("Failed to generate feature params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const filename = await findFeatureFile(slug);
    if (!filename) {
      return { title: "Feature Not Found" };
    }

    const { data } = await fetchMdxWithFrontmatter<FeatureProps>(
      `${CONTENT_CONFIG.paths.featureItems}/${filename}`
    );
    const feature = data.features;

    return {
      title: feature?.title || "Feature",
      description: feature?.description || "Feature details",
      openGraph: {
        title: feature?.title,
        description: feature?.description,
        images: feature?.hero_image ? [{ url: feature.hero_image }] : undefined,
      },
    };
  } catch {
    return {
      title: "Feature Not Found",
    };
  }
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;

  try {
    const filename = await findFeatureFile(slug);

    if (!filename) {
      return notFound();
    }

    const { data, content } = await fetchMdxWithFrontmatter<FeatureProps>(
      `${CONTENT_CONFIG.paths.featureItems}/${filename}`
    );
    const feature = data.features;

    if (!feature) {
      return notFound();
    }

    return (
      <div className="bg-background">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                  {feature.tagline || "Feature"}
                </span>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  {feature.title}
                </h1>

                <p className="text-lg text-muted leading-relaxed mb-8">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#"
                    className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white"
                  >
                    {feature.cta || "Get Started"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="#how-it-works"
                    className="btn-secondary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-foreground"
                  >
                    See how it works
                  </a>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="relative bg-surface-elevated rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
                  {feature.hero_image ? (
                    <Image
                      src={feature.hero_image}
                      alt={feature.title}
                      width={600}
                      height={400}
                      className="rounded-2xl"
                    />
                  ) : (
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div
                        className="w-24 h-24 text-primary"
                        dangerouslySetInnerHTML={{ __html: feature.icon || "" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        {feature.benefits && feature.benefits.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Key Benefits
                </h2>
                <p className="text-muted text-lg max-w-2xl mx-auto">
                  Discover what makes {feature.title} powerful
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feature.benefits.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className="group p-6 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {benefit.icon ? (
                        <div className="w-6 h-6 text-primary" dangerouslySetInnerHTML={{ __html: benefit.icon }} />
                      ) : (
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        {feature.how_it_works && feature.how_it_works.length > 0 && (
          <section id="how-it-works" className="py-16 md:py-24 bg-surface">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  How It Works
                </h2>
                <p className="text-muted text-lg">
                  Simple steps to get started
                </p>
              </div>

              <div className="relative">
                {/* Connecting line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/10 hidden md:block" />

                <div className="space-y-8">
                  {feature.how_it_works.map((step, index) => (
                    <div key={step.title} className="relative flex gap-6 md:gap-8">
                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25">
                          {step.step || index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="p-6 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800">
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Integrations Section */}
        {feature.integrations && feature.integrations.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Works With Your Stack
                </h2>
                <p className="text-muted text-lg">
                  Seamlessly integrates with the tools you already use
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {feature.integrations.map((integration) => (
                  <div
                    key={integration}
                    className="px-6 py-3 rounded-full bg-surface-elevated border border-gray-200 dark:border-gray-800 text-foreground font-medium hover:border-primary/30 transition-colors"
                  >
                    {integration}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonial Section */}
        {feature.testimonial && (
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
              <div className="relative">
                <svg className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-8">
                  "{feature.testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  {feature.testimonial.avatar ? (
                    <Image
                      src={feature.testimonial.avatar}
                      alt={feature.testimonial.author}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg">
                      {feature.testimonial.author.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{feature.testimonial.author}</div>
                    <div className="text-sm text-muted">
                      {feature.testimonial.role}, {feature.testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MDX Content */}
        {content && content.trim() && (
          <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted prose-a:text-primary prose-strong:text-foreground">
                <MDXRemote source={content} />
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to get started with {feature.title}?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using our platform to automate their workflows.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </a>
              <a
                href="#"
                className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch feature:", error);
    return notFound();
  }
}
