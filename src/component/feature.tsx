import { FeatureGridProps } from "@/types/define_props";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const Feature = ({ grid }: FeatureGridProps) => {
  return (
    <section className="py-16 md:py-24 section-mesh">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {grid.title}
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            {grid.subtitle}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {grid.features.map((item, index) => {
            const slug = slugify(item.title);
            const href = `/features/${slug}`;

            return (
              <div
                key={item.title}
                className="group relative p-8 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 card-hover card-glow text-center"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="icon-container w-16 h-16 mx-auto rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div
                      className="w-8 h-8 text-primary"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Gradient underline */}
                  <div className="w-12 h-1 mx-auto rounded-full bg-gradient-to-r from-primary to-primary/50 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Description */}
                  <p className="text-muted text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* CTA */}
                  <a
                    href={href}
                    className="inline-flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all duration-300"
                  >
                    {item.cta}
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
