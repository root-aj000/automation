import { CaseStudyProps } from "@/types/define_props";
import Link from "next/link";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UniversalCardCase = ({ case_data }: CaseStudyProps) => {
  const cases = Array.isArray(case_data) ? case_data : [case_data];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
      {cases.map((casedata, index) => {
        const slug = slugify(casedata.title);
        const href = `/case-studies/${slug}`;

        return (
          <Link
            key={slug}
            href={href}
            className="group relative block cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 card-hover card-glow bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/50"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            {/* 
            // TODO: To enable cover image, uncomment this code and remove the placeholder below
            <div className="relative h-48 w-full overflow-hidden">
              <Image 
                src={casedata.image || "/placeholder.jpg"} 
                alt={casedata.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            */}
            {/* Cover Image Placeholder */}
            <div className="relative h-48 w-full bg-surface-elevated overflow-hidden flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
              <svg className="w-12 h-12 text-muted/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            {/* Card content */}
            <div className="relative z-20 p-6">
              {/* Industry badge */}
              <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
                Case Study
              </span>

              <h4 className="text-foreground font-semibold text-lg leading-7 mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {casedata.title}
              </h4>

              {/* Meta info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  {/* Author avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {casedata.author?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-sm text-muted">By {casedata.author}</span>
                </div>

                <span className="text-xs text-primary font-medium">
                  {new Date(casedata.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Read more arrow */}
              <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Read case study</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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
