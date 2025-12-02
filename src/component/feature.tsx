import { FeatureGridProps } from "@/types/define_props";
function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}
export const Feature = ({ grid }: FeatureGridProps) => {
  return (
    <section className="bg-background py-6 sm:py-8 lg:py-12 mb-24">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground md:mb-6 lg:text-3xl">
            {grid.title}
          </h2>
          <p className="mx-auto max-w-3xl text-center text-gray-500 dark:text-gray-400 md:text-lg">
            {grid.subtitle}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-3 xl:gap-16">
          {grid.features.map((item) => {
            const slug = slugify(item.title);
            const href = `/features/${slug}`;
            return (
              <div
                key={item.title} // ✅ FIXED: key should be here
                className="flex flex-col items-center"
              >
                {/* Icon */}
                <div className="mb-2 flex h-12 w-12 items-center justify-center sm:mb-4 md:h-14 md:w-14">
                  <div
                    className="h-full w-full"
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-center text-lg font-semibold md:text-xl">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mb-2 text-center text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>

                {/* CTA */}
                <a
                  href={`${href}`}
                  className="font-bold text-primary transition duration-100 hover:text-primary-dark active:text-primary-dark"
                >
                  {item.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
