import { Hero_2Props } from "@/types/define_props";
import Image from "next/image";
export const Hero_2 = ({ Hero_2 }: Hero_2Props) => {
  return (
    <>
      <div className="bg-background pb-6 sm:pb-8 lg:pb-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="mb-8 py-4 md:mb-12 md:py-8 xl:mb-12"></header>
          <section className="mb-8 flex flex-col justify-between gap-6 sm:gap-10 md:mb-16 md:gap-16 md:flex-row-reverse">
            <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-1/2">
              <p className="mb-4 font-semibold text-primary md:mb-6 md:text-lg xl:text-xl">
                {Hero_2.tg_line}
              </p>
              <h1 className="mb-8 text-4xl font-bold text-foreground sm:text-5xl md:mb-12 md:text-6xl">
                {Hero_2.mh_line}
              </h1>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#"
                  className="inline-block rounded-lg bg-primary px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-primary/50 transition duration-100 hover:bg-primary-dark focus-visible:ring active:bg-primary-dark md:text-base"
                >
                  {Hero_2.p_cta}
                </a>
                <a
                  href="#"
                  className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-primary/50 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  {Hero_2.s_cta}
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left md:1/2 xl:w-1/2">
              <div>
                {/* <Image
                  src={Hero_2.image}
                  loading="lazy"
                  alt={Hero_2.alt}
                  className="h-full w-full object-cover object-center"
                /> */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
