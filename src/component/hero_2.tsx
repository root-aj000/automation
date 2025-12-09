import { Hero_2Props } from "@/types/define_props";
import Image from "next/image";

export const Hero_2 = ({ Hero_2 }: Hero_2Props) => {
  return (
    <section className="relative overflow-hidden section-mesh">
      {/* Decorative Blobs */}
      <div className="blob blob-primary w-80 h-80 top-20 -right-40 animate-float" />
      <div className="blob blob-secondary w-64 h-64 bottom-20 -left-32 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <section className="flex flex-col justify-between gap-8 sm:gap-12 md:gap-16 lg:flex-row-reverse lg:items-center py-12 md:py-20">
            {/* Content */}
            <div className="flex flex-col justify-center text-center lg:text-left lg:w-1/2 animate-fade-in-up">
              <p className="mb-4 font-semibold text-primary md:mb-6 md:text-lg xl:text-xl inline-flex items-center justify-center lg:justify-start gap-2">
                <span className="w-8 h-[2px] bg-primary rounded-full" />
                {Hero_2.tg_line}
              </p>

              <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl leading-tight">
                {Hero_2.mh_line}
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-sm font-semibold text-white md:text-base group"
                >
                  {Hero_2.p_cta}
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
                  {Hero_2.s_cta}
                </a>
              </div>
            </div>

            {/* Visual Area */}
            <div className="flex flex-col justify-center lg:w-1/2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse-glow" />
                <div className="relative glass rounded-3xl p-8 min-h-[300px] md:min-h-[400px] flex items-center justify-center">
                  {/* Automation workflow visual */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="icon-container w-16 h-16 rounded-xl animate-bounce-subtle"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    ))}
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
