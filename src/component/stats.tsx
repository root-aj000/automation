import { StatsProps } from "@/types/define_props";
import React from "react";
export const Stats = ({ stats }: StatsProps) => {
  return <>
    <section className="py-9 mb-24 px-4 md:px-8">
      <div className="bg-background text-foreground">
        <div className="grid md:grid-cols-2 items-center gap-16 max-w-screen-2xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold text-primary">{stats.heading}</h1>
            <p className="mt-6 text-sm">{stats.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {stats.items.map(({ value, label }) => (
              <div className="bg-gray-100 flex flex-col items-center text-center rounded md:p-8 p-6" key={value}>
                <h3 className="lg:text-5xl text-3xl font-extrabold text-primary">{value}</h3>
                <div className="mt-4">
                  <p className="text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  </>;
};
