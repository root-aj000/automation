import React from "react";

interface ResultItem {
  metric: string;
  value: string;
  description?: string;
}

interface ResultsSectionProps {
  results: string | ResultItem[];
  title?: string;
  subtitle?: string;
}

export default function ResultsSection({
  results,
  title = "Measurable Results",
  subtitle = "Real outcomes from real customers"
}: ResultsSectionProps) {
  if (!results) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Proven Results
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted">
            {subtitle}
          </p>
        </div>

        {typeof results === 'string' ? (
          // String-based results display
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 md:p-12 rounded-3xl bg-surface-elevated border border-gray-200 dark:border-gray-800 shadow-xl">
              {/* Decorative accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>

              <p className="text-xl md:text-2xl text-foreground leading-relaxed text-center mt-4">
                {results}
              </p>
            </div>
          </div>
        ) : (
          // Metrics-based results display
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((result, index) => (
              <div
                key={result.metric || index}
                className="group relative p-8 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/30 transition-all duration-300 hover:shadow-xl text-center"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Value */}
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    <span className="gradient-text">{result.value}</span>
                  </div>

                  {/* Metric */}
                  <div className="text-lg font-semibold text-foreground mb-2">
                    {result.metric}
                  </div>

                  {/* Description */}
                  {result.description && (
                    <p className="text-sm text-muted">
                      {result.description}
                    </p>
                  )}
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full group-hover:w-16 transition-all duration-300" />
              </div>
            ))}
          </div>
        )}

        {/* Optional: Add comparison visual */}
        {typeof results !== 'string' && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-muted">Before</span>
              </div>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted">After using our solution</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
