import { logo_cloudProps } from "@/types/define_props";
import React from "react";

export const LogoCloud = ({ logo_cloud }: logo_cloudProps) => {
  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <h2 className="text-center text-lg md:text-xl font-medium text-muted mb-8 md:mb-12">
          {logo_cloud.title}
        </h2>

        {/* Logo grid with hover effects */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Logos container */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 py-6">
            {logo_cloud.logos.map((logo, index) => (
              <div
                key={index}
                className="group relative px-4 py-3 rounded-xl transition-all duration-300 hover:bg-surface"
              >
                <div
                  className="h-8 w-auto md:h-10 lg:h-12 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: logo }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-sm text-muted mt-8">
          Trusted by <span className="text-primary font-medium">1000+</span> companies worldwide
        </p>
      </div>
    </section>
  );
};
