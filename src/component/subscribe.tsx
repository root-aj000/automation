import { SubscribeFormProps } from "@/types/define_props";
import React from "react";
export const Subscribe = ({ subscribe }: SubscribeFormProps) => {
  return <>
    <div className="mx-auto max-w-screen-2xl">
      <h2 className="mb-4 text-3xl font-bold md:text-5xl text-center">
        {subscribe.title}
      </h2>
      <p className="mx-auto mb-6 max-w-screen-2xl text-sm text-gray-500 dark:text-gray-400 sm:text-base md:mb-12">
        {subscribe.description}
      </p>

      <div className="mx-auto mb-4 flex max-w-screen-2xl justify-center">
        <form name="email-form" method="get" className="relative w-full max-w-lg">
          <input
            type="email"
            className="h-9 w-full border border-solid border-foreground/20 bg-background px-3 py-6 text-sm text-foreground"
            placeholder={subscribe.placeholder}
            required
          />
          <input
            type="submit"
            value={subscribe.buttonText}
            className="relative right-0 top-1 w-full cursor-pointer bg-primary px-6 py-2 text-center font-semibold text-white sm:absolute sm:right-[5px] sm:w-auto"
          />
        </form>
      </div>
    </div>

  </>;
};
