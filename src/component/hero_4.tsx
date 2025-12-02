import { Hero_4Props } from "@/types/define_props";
import Image from "next/image";
export const Hero_4 = ({ Hero_4 }: Hero_4Props) => {
  return (
    <>
      <div className="bg-background pb-6 sm:pb-8 lg:pb-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="mb-8 py-4 md:mb-12 md:py-8 xl:mb-12"></header>

          <section className="mb-8 flex flex-col justify-between gap-6 sm:gap-10 md:mb-16 md:gap-16 md:flex-row">
            <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-1/2">
              <h1 className="mb-8 text-4xl font-bold text-foreground sm:text-5xl md:mb-12 md:text-6xl">
                {Hero_4.mh_line}
              </h1>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#"
                  className="inline-block rounded-lg bg-primary px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary/50 transition duration-100 hover:bg-primary-dark focus-visible:ring active:bg-primary-dark md:text-base"
                >
                  {Hero_4.p_cta}
                </a>

                <a
                  href="#"
                  className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-primary/50 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  {Hero_4.s_cta}
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left md:1/2 xl:w-1/2">
              <div>
                {/* <Image
                  src={Hero_4.image}
                  loading="lazy"
                  alt={Hero_4.alt}
                  className="h-full w-full object-cover object-center rounded-full"
                /> */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
