import { logo_cloudProps } from "@/types/define_props";
import React from "react";
export const LogoCloud = ({ logo_cloud }: logo_cloudProps) => {
  return (
    <>
      <section className="bg-background py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground md:mb-8 lg:text-3xl">
            {logo_cloud.title}
          </h2>

          <div className="grid grid-cols-2 gap-6 rounded-lg bg-background p-6 sm:h-40 sm:content-evenly md:grid-cols-4">
            {logo_cloud.logos.map((logo) => {
              return (
                <div className="flex justify-center" key={logo}>
                  <div
                    className="h-6 w-auto sm:h-8 lg:h-10"
                    dangerouslySetInnerHTML={{ __html: logo }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
