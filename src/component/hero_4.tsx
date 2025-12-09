import { Hero_4Props } from "@/types/define_props";
import Image from "next/image";

export const Hero_4 = ({ Hero_4 }: Hero_4Props) => {
  return (
    <section className="relative overflow-hidden section-gradient min-h-[80vh] flex items-center">
      {/* Decorative Blobs */}
      <div className="blob blob-primary w-[500px] h-[500px] -top-64 -right-64 animate-float" />
      <div className="blob blob-secondary w-96 h-96 -bottom-48 -left-48 animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <section className="flex flex-col justify-between gap-10 lg:gap-16 lg:flex-row lg:items-center">
            {/* Content */}
            <div className="flex flex-col justify-center text-center lg:text-left lg:w-1/2 animate-fade-in-up">
              <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl leading-tight">
                <span className="gradient-text">{Hero_4.mh_line.split(' ').slice(0, 2).join(' ')}</span>
                {' '}
                {Hero_4.mh_line.split(' ').slice(2).join(' ')}
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#"
                  className="btn-primary inline-flex items-center justify-center rounded-xl px-8 py-4 text-center text-sm font-semibold text-white md:text-base group"
                >
                  {Hero_4.p_cta}
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
                  {Hero_4.s_cta}
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-muted text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever</span>
                </div>
              </div>
            </div>

            {/* Visual Area */}
            <div className="lg:w-1/2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-20 animate-pulse-glow" />
                <div className="relative glass rounded-3xl p-8 min-h-[350px] md:min-h-[450px]">
                  {/* Animated automation flow */}
                  <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="flex items-center gap-4">
                      <div className="icon-container w-16 h-16 rounded-2xl animate-bounce-subtle">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-primary/30 rounded-full" />
                      <div className="icon-container w-16 h-16 rounded-2xl animate-bounce-subtle" style={{ animationDelay: '0.3s' }}>
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="w-12 h-[2px] bg-gradient-to-r from-primary/30 to-primary rounded-full" />
                      <div className="icon-container w-16 h-16 rounded-2xl animate-bounce-subtle" style={{ animationDelay: '0.6s' }}>
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-muted text-sm text-center">Trigger → Process → Complete</p>
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
