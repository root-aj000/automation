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
              <Image
                className="object-cover w-full"
                src={Howitworks.image}
                alt={Howitworks.title}
              />
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
                      <Image
                        className="rounded-xl w-full h-auto max-w-sm"
                        src={step.svg}
                        alt={step.title}
                      />
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
