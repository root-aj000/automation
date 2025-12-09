import { UniversalUseCaseCardProps } from "@/types/define_props";
import Link from "next/link";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UniversalUseCaseCard = ({ usecase_data, industryname }: UniversalUseCaseCardProps) => {
  const usecases = Array.isArray(usecase_data) ? usecase_data : [usecase_data];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {usecases.map((usecase, index) => {
        const slug = slugify(usecase.title);
        const href = `/use-cases/${industryname}/${slug}`;

        return (
          <Link
            key={slug}
            href={href}
            className="group relative block cursor-pointer rounded-2xl p-6 transition-all duration-300 card-hover card-glow bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/50"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient border overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="icon-container w-12 h-12 rounded-xl mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h4 className="text-foreground font-semibold text-lg leading-7 mb-3 group-hover:text-primary transition-colors duration-300">
                {usecase.title}
              </h4>

              <p className="text-muted text-sm leading-relaxed mb-4">
                {usecase.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center text-primary text-sm font-medium">
                <span className="group-hover:mr-2 transition-all duration-300">Learn more</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
