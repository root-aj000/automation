import Image from "next/image";

interface UseCaseHeroProps {
  title: string;
  description: string;
  hero_image?: string;
  industry?: string;
  tagline?: string;
}

export default function UseCaseHero({
  title,
  description,
  hero_image,
  industry,
  tagline,
}: UseCaseHeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-primary/5" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 79 31 / 0.08) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              {/* Breadcrumb / Industry Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {industry && (
                  <span className="px-4 py-1.5 rounded-full bg-surface-elevated border border-gray-200 dark:border-gray-700 text-sm font-medium text-muted">
                    {industry}
                  </span>
                )}
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {tagline || "Use Case"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                {title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted leading-relaxed mb-8 max-w-xl">
                {description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#solution"
                  className="group btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white"
                >
                  See How It Works
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="#contact"
                  className="btn-secondary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-foreground"
                >
                  Talk to Sales
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Setup in minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image/Visual */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-xl opacity-60" />

                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-surface-elevated">
                  {/* 
                    // TODO: To enable the hero image, uncomment the following code and remove the placeholder below
                    hero_image ? (
                    <Image
                      src={hero_image}
                      alt={title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  ) : ( 
                  */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <svg className="w-24 h-24 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  {/* ) */}
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 px-6 py-3 rounded-xl bg-surface-elevated border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Proven Results</div>
                      <div className="text-xs text-muted">See success stories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
