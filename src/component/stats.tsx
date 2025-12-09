import { StatsProps } from "@/types/define_props";
import React from "react";

export const Stats = ({ stats }: StatsProps) => {
  return (
    <section className="py-16 md:py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">{stats.heading}</span>
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              {stats.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.items.map(({ value, label }, index) => (
              <div
                key={value}
                className="group relative p-6 md:p-8 text-center rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 card-hover card-glow"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold gradient-text mb-2">
                    {value}
                  </h3>
                  <p className="text-muted text-sm md:text-base font-medium">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
