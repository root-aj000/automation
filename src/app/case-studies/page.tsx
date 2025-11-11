import { getAllCase } from "@/utils/CasePage";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Pagination } from "@/component/pagination";
import { Home_header_blogProps } from "@/types/define_props";

const ITEMS_PER_PAGE = 20; // ✅ 5 blogs per page

export default async function CasePage() {
  const allCase = getAllCase();
  const currentPage = 1;
  const startIndex = 0;
  const endIndex = ITEMS_PER_PAGE;
  const paginatedCase = allCase.slice(startIndex, endIndex);

  const Home_header_blog: Home_header_blogProps["Home_header_blog"] = {
    title: "Our Blog",
    subtitle: "Insights, stories, and updates from our team.",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-white">
      <HomeBlogSection
        Home_header_blog={Home_header_blog}
        blog_data={paginatedCase}
      />
      <Pagination
        currentPage={currentPage}
        totalItems={allCase.length}
        itemsPerPage={ITEMS_PER_PAGE}
        basePath="/case-studies"
      />
    </div>
  );
}
