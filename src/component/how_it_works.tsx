import { HowItWorksProps } from "@/types/define_props";
import React from "react";
import Image from "next/image";

export const HowItWorks = ({ Howitworks }: HowItWorksProps) => {
  return (
    <section className="py-16 md:py-24 section-mesh">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-muted text-base font-medium block mb-4">
            {Howitworks.subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="gradient-text">{Howitworks.title}</span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-15 animate-pulse-glow" />
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {/* 
              // TODO: To enable the main image, uncomment this code and remove the placeholder
              <Image
                className="object-cover w-full"
                src={Howitworks.image}
                alt={Howitworks.title}
              />
              */}
              <div className="w-full h-64 md:h-96 bg-surface-elevated flex items-center justify-center">
                <svg className="w-20 h-20 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6 md:space-y-8">
            {Howitworks.steps.map((step, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 card-hover"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Step number */}
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    Step
                  </span>

                  <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h4>

                  <p className="text-muted leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step image if available */}
                  {step.svg && (
                    <div className="mt-4 rounded-xl overflow-hidden">
                      {/* 
                      // TODO: To enable step image, uncomment this code
                      <Image
                        className="rounded-xl w-full h-auto max-w-sm"
                        src={step.svg}
                        alt={step.title}
                      />
                      */}
                      <div className="rounded-xl w-full h-40 bg-background/50 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
                        <span className="text-xs text-muted">Feature Preview</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
