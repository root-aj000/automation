import React from 'react';
import { UseCaseCardprops } from '@/types/define_props';
import Link from 'next/link';

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UseCaseCard = ({ usecase_data, industryname }: UseCaseCardprops & { industryname?: string }) => {
  const usecases = Array.isArray(usecase_data) ? usecase_data : [usecase_data];

  return (
    <section className="py-12 md:py-16 section-gradient">
      <div className="mx-auto max-w-7xl px-4 2xl:px-0">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Industries
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Explore Our Use Cases by <span className="gradient-text">Industry</span>
          </h2>
        </div>

        {/* Use case grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {usecases.map((usecase) => {
            const slug = slugify(usecase.title);
            const href = industryname ? `/use-cases/${industryname}/${slug}` : `/use-cases/${slugify(usecase.title)}`;
            return (
              <Link
                href={href}
                key={href}
                className="group flex items-center gap-3 rounded-xl p-4 bg-surface-elevated border border-gray-200 dark:border-gray-800 card-hover hover:border-primary/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="icon-container w-10 h-10 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {usecase.title}
                </span>

                {/* Arrow */}
                <svg
                  className="w-4 h-4 ml-auto text-muted opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
