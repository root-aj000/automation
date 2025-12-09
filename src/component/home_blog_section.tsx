import { Home_header_blogProps, BlogCardProps } from "@/types/define_props";
import { UniversalCard } from "@/component/universal_card"

type Combine_data = Home_header_blogProps & BlogCardProps;

export const HomeBlogSection = ({ Home_header_blog, blog_data }: Combine_data) => {
  return (
    <section className="py-16 md:py-24 section-mesh">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {Home_header_blog.title}
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            {Home_header_blog.subtitle}
          </p>
        </div>

        <UniversalCard blog_data={blog_data} />
      </div>
    </section>
  );
};
