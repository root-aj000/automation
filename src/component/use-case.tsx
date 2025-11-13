import React from 'react';
import { UseCaseCardprops } from '@/types/define_props';
import Link from 'next/link';

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UseCaseCard = ({ usecase_data, industryname }: UseCaseCardprops & { industryname?: string }) => {
  const usecases = Array.isArray(usecase_data) ? usecase_data : [usecase_data];

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-4 flex items-center justify-between gap-4 md:mb-8">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Explore Our Use Cases by Industry
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {usecases.map((usecase) => {
            const slug = slugify(usecase.title);
            const href = industryname ? `/use-cases/${industryname}/${slug}` : `/use-cases/${slugify(usecase.title)}`;
            return (
              <Link
                href={href}
                key={href}
                className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50"
              >
                <div
                  className="me-2 h-4 w-4 shrink-0 text-gray-900"
                  // dangerouslySetInnerHTML={{ __html: usecase.icon }}
                />
                <span className="text-sm font-medium text-gray-900">
                  {usecase.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
