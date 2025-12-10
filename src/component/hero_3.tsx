import { Hero_3Props } from "@/types/define_props";
import Image from "next/image";

export const Hero_3 = ({ Hero_3 }: Hero_3Props) => {
  return (
    <section className="relative overflow-hidden section-mesh">
      {/* Decorative Blobs */}
      <div className="blob blob-primary w-96 h-96 -top-48 left-1/4 animate-float" />
      <div className="blob blob-secondary w-72 h-72 bottom-0 right-1/4 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <section className="flex flex-col gap-8 sm:gap-12 md:gap-16 py-12 md:py-20">
            {/* Content - Centered */}
            <div className="flex flex-col justify-center text-center max-w-4xl mx-auto animate-fade-in-up">
              <p className="mb-4 font-semibold text-primary md:mb-6 md:text-lg xl:text-xl inline-flex items-center justify-center gap-2">
                <span className="w-8 h-[2px] bg-primary rounded-full" />
                {Hero_3.tg_line}
                <span className="w-8 h-[2px] bg-primary rounded-full" />
              </p>

              <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl leading-tight">
                {Hero_3.mh_line}
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="#"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-sm font-semibold text-white md:text-base group"
                >
                  {Hero_3.p_cta}
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
                  {Hero_3.s_cta}
                </a>
              </div>
            </div>

            {/* Visual Area - Full Width */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative max-w-5xl mx-auto">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-15 animate-pulse-glow" />
                <div className="relative glass rounded-3xl p-6 md:p-10">
                  {/* Dashboard Preview Grid */}
                  {/* 
                  // TODO: To enable hero image, uncomment this code and remove the grid below
                  <Image 
                    src={Hero_3.image || "/placeholder.jpg"} 
                    alt={Hero_3.alt || "Hero Image"} 
                    width={1000} 
                    height={600} 
                    className="rounded-2xl shadow-2xl w-full"
                  /> 
                  */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                      { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "Triggers" },
                      { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "Workflows" },
                      { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Analytics" },
                      { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "Scheduling" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-surface-elevated rounded-2xl p-5 text-center card-hover card-glow"
                      >
                        <div className="icon-container w-12 h-12 mx-auto rounded-xl mb-3">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
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
