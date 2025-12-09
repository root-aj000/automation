"use client";
import Image from "next/image";
import { Hero_1Props } from "@/types/define_props";

export const Hero_1 = ({ Hero_1 }: Hero_1Props) => {
  return (
    <section className="relative overflow-hidden section-mesh">
      {/* Decorative Blobs */}
      <div className="blob blob-primary w-96 h-96 -top-48 -right-48 animate-float" />
      <div className="blob blob-secondary w-72 h-72 -bottom-36 -left-36 animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <section className="flex flex-col justify-between gap-8 sm:gap-12 md:gap-16 lg:flex-row lg:items-center py-12 md:py-20">
            {/* Content */}
            <div className="flex flex-col justify-center text-center lg:text-left lg:w-1/2 animate-fade-in-up">
              <p className="mb-4 font-semibold text-primary md:mb-6 md:text-lg xl:text-xl inline-flex items-center justify-center lg:justify-start gap-2">
                <span className="w-8 h-[2px] bg-primary rounded-full" />
                {Hero_1.tg_line}
              </p>

              <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl leading-tight">
                {Hero_1.mh_line}
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-sm font-semibold text-white md:text-base group"
                >
                  {Hero_1.p_cta}
                  <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="btn-secondary inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-sm font-semibold text-foreground md:text-base"
                >
                  {Hero_1.s_cta}
                </a>
              </div>
            </div>

            {/* Image/Visual Area */}
            <div className="flex flex-col justify-center lg:w-1/2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                {/* Gradient background for image area */}
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse-glow" />
                <div className="relative glass rounded-3xl p-8 min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                  {/* Placeholder for automation visual */}
                  <div className="text-center">
                    <div className="icon-container w-20 h-20 mx-auto rounded-2xl mb-4">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-muted text-sm">Automation Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
