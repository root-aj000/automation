import { BlogCardProps } from "@/types/define_props";
import Image from "next/image";
import Link from "next/link";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UniversalCard = ({ blog_data }: BlogCardProps) => {
  const blogs = Array.isArray(blog_data) ? blog_data : [blog_data];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog, index) => {
        const slug = slugify(blog.title);
        const href = `/blogs/${slug}`;

        return (
          <Link
            key={slug}
            href={href}
            className="group relative block cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 card-hover card-glow bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/50"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            {/* Card content */}
            <div className="relative z-20 p-6">
              {/* Category badge */}
              {blog.category && (
                <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
                  {blog.category}
                </span>
              )}

              <h4 className="text-foreground font-semibold text-lg leading-7 mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {blog.title}
              </h4>

              {/* Meta info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  {/* Author avatar placeholder */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {blog.author?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-sm text-muted">By {blog.author}</span>
                </div>

                <span className="text-xs text-primary font-medium">
                  {new Date(blog.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Read more arrow */}
              <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>Read article</span>
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
