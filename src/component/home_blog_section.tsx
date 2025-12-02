import { Home_header_blogProps, BlogCardProps } from "@/types/define_props";
import { UniversalCard } from "@/component/universal_card"


type Combine_data = Home_header_blogProps & BlogCardProps;
export const HomeBlogSection = ({ Home_header_blog, blog_data }: Combine_data) => {
  return (
    <>
      <div className="mb-10 md:mb-16 bg-background">
        <h2 className="mb-4 text-center text-2xl font-bold text-foreground md:mb-6 lg:text-3xl">
          {Home_header_blog.title}
        </h2>

        <p className="mx-auto max-w-3xl text-center text-gray-500 dark:text-gray-400 md:text-lg">
          {Home_header_blog.subtitle}

        </p>
        <UniversalCard blog_data={blog_data} />
      </div>
    </>
  );
};
