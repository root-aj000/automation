import { HowItWorksProps } from "@/types/define_props";
import React from "react";
import Image from "next/image";
export const HowItWorks = ({ Howitworks }: HowItWorksProps) => {
  return (
    <>
      <section className="py-3">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
          <div className="w-full flex-col justify-start items-center gap-2 inline-flex">
            <div className="w-full flex-col justify-start items-center gap-1 flex">
              <span className="text-center text-gray-500 dark:text-gray-400 text-base font-normal">
                {Howitworks.subtitle}
              </span>
              <h2 className="text-center text-[#f12603] text-4xl font-bold leading-normal">
                {Howitworks.title}
              </h2>
            </div>
            <div className="w-full lg:items-start items-center lg:gap-16 gap-8 flex lg:flex-row flex-col">
              <Image
                className="object-cover"
                src={Howitworks.image}
                alt={Howitworks.title}
              />
              <div className="swiper mySwiper flex flex-col gap-3 w-full">
                <div className="swiper-wrapper">
                  {Howitworks.steps.map((step, index) => {
                    return (
                      <div className="swiper-slide mb-20" key={index}>
                        <div className="flex-col gap-4 flex">
                          <span className="text-[#f12603] text-base font-medium">
                            {index + 1} Step
                          </span>
                          <div className="flex-col gap-1.5 flex">
                            <h4 className="text-foreground text-xl font-semibold">
                              {step.title}
                            </h4>
                            <p className="text-gray-400 dark:text-gray-500 text-base">
                              {step.description}
                            </p>
                            <figure className="max-w-lg mx-auto">
                              <Image
                                className="rounded-lg h-auto max-w-full"
                                src={step.svg}
                                alt={step.svg}
                              />
                              <figcaption className="mt-2 text-sm text-center text-gray-700 dark:text-gray-300">
                                {/* {step.caption} */}
                              </figcaption>
                            </figure>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="swiper-pagination lg:justify-start justify-center"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
