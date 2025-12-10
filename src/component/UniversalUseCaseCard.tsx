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

            {/* 
            // TODO: To enable cover image, uncomment this code and remove the placeholder below
            <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
              <Image 
                src={usecase.hero_image || "/placeholder.jpg"} 
                alt={usecase.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            */}
            {/* Cover Image Placeholder */}
            <div className="relative h-40 w-full bg-surface-elevated overflow-hidden rounded-t-2xl flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
              <svg className="w-10 h-10 text-muted/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

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
