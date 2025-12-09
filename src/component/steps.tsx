import { HowItWorksProps } from "@/types/define_props";
import React from "react";

export const Steps = ({ Howitworks }: HowItWorksProps) => {
  return (
    <section className="py-16 md:py-24 section-gradient">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Simple steps to <span className="gradient-text">get started</span>
          </h2>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/10 hidden sm:block" />

          <div className="space-y-8 md:space-y-12">
            {Howitworks.steps.map((item, index) => (
              <div
                key={item.title}
                className="group relative flex gap-6 md:gap-8"
              >
                {/* Step number circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 pb-8 md:pb-12">
                  <div className="p-6 md:p-8 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 card-hover card-glow">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
