import React from "react";

interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
}

interface BenefitsSectionProps {
  benefits: string[] | BenefitItem[];
  title?: string;
  subtitle?: string;
}

export default function BenefitsSection({
  benefits,
  title = "The Solution",
  subtitle = "How we transform your workflow"
}: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  const isObjectArray = (arr: unknown[]): arr is BenefitItem[] => {
    return arr.length > 0 && typeof arr[0] === 'object';
  };

  return (
    <section id="solution" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            With Our Solution
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted">
            {subtitle}
          </p>
        </div>

        {/* Benefits Grid with alternating layout */}
        {isObjectArray(benefits) ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title || index}
                className={`group p-8 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/30 transition-all duration-300 hover:shadow-xl ${index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
              >
                {/* Icon with animated background */}
                <div className="relative w-14 h-14 mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl group-hover:scale-110 transition-transform duration-300" />
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                    {benefit.icon ? (
                      <div className="w-7 h-7 text-white" dangerouslySetInnerHTML={{ __html: benefit.icon }} />
                    ) : (
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {(benefits as string[]).map((benefit, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-6 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/30 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-foreground leading-relaxed pt-1">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
