"use client";

import React, { useState } from "react";
import { ForWhomBlock } from "@/types/define_props";

export const ForWhom = ({ forwhom }: ForWhomBlock) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure items is an array
  const items = Array.isArray(forwhom?.items) ? forwhom.items : [];

  // Don't render if no meaningful data
  if (!forwhom?.title && items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-surface to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
        {/* Dots pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 79 31 / 0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header - Left aligned for uniqueness */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                Perfect For
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4">
              {forwhom?.title || "Who Is This For?"}
            </h2>

            {forwhom?.description && (
              <p className="text-lg text-muted leading-relaxed">
                {forwhom.description}
              </p>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 lg:gap-10">
            {[
              { value: `${items.length}+`, label: "Use Cases" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Cards */}
        {items.length > 0 && (
          <div className="relative">
            {/* Desktop: Bento-style grid */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div
                  key={item.title || index}
                  className={`group relative rounded-3xl transition-all duration-500 cursor-pointer ${index === 0 ? "row-span-2" : ""
                    }`}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {/* Card background with gradient border effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${activeIndex === index ? "opacity-100" : ""
                    }`} />

                  <div className={`relative h-full p-8 rounded-3xl border-2 transition-all duration-300 ${activeIndex === index
                      ? "border-primary/40 bg-surface-elevated shadow-2xl shadow-primary/10"
                      : "border-gray-200 dark:border-gray-800 bg-surface-elevated/50 hover:border-primary/20"
                    }`}>
                    {/* Number indicator */}
                    <div className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${activeIndex === index
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-muted"
                      }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Icon */}
                    {item.icon && (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${activeIndex === index
                          ? "bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25"
                          : "bg-gradient-to-br from-primary/10 to-primary/5"
                        }`}>
                        <div
                          className={`w-8 h-8 transition-colors duration-300 ${activeIndex === index ? "text-white" : "text-primary"
                            }`}
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${activeIndex === index ? "text-primary" : "text-foreground"
                      }`}>
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-muted leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Arrow indicator with link */}
                    <a
                      href={item.href || "#"}
                      className={`mt-6 inline-flex items-center gap-2 text-primary font-semibold transition-all duration-300 hover:gap-3 ${activeIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        }`}
                    >
                      Learn more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden -mx-4 px-4">
              <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {items.map((item, index) => (
                  <div
                    key={item.title || index}
                    className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center"
                  >
                    <div className="h-full p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface-elevated">
                      {/* Icon */}
                      {item.icon && (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                          <div
                            className="w-7 h-7 text-primary"
                            dangerouslySetInnerHTML={{ __html: item.icon }}
                          />
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-muted text-sm leading-relaxed mb-4">{item.description}</p>
                      )}
                      <a
                        href={item.href || "#"}
                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
                      >
                        Learn more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {forwhom?.p_cta && (
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#"
                className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary bg-[length:200%_100%] animate-gradient" />
                <span className="relative flex items-center gap-2">
                  {forwhom.p_cta}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>

              <span className="text-muted text-sm">
                No credit card required
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};