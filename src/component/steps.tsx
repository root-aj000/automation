import { HowItWorksProps } from "@/types/define_props";
import React from "react";
export const Steps = ({ Howitworks }: HowItWorksProps) => {
  return <>
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-col w-full md:w-2/3 mx-auto">
          {Howitworks.steps.map((item) => (
            <div className="flex relative pt-10 pb-20 sm:items-center" key={item.title}>
              <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
              </div>
              <div className="shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-red-500 text-white relative z-10 title-font font-medium text-sm">

              </div>
              <div className="grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
                <div className="shrink-0 w-24 h-24 bg-red-100 text-red-500 rounded-full inline-flex items-center justify-center">
                  {item.svg}
                </div>
                <div className="grow sm:pl-6 mt-6 sm:mt-0">
                  <h2 className="font-medium title-font text-foreground mb-1 text-xl">
                    {item.title}
                  </h2>
                  <p className="leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>;
};
