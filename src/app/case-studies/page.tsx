import { getAllCase } from "@/utils/CasePage";
import { HomeCaseSection } from "@/component/home_case_section";
import { Pagination } from "@/component/pagination";
import { Home_header_casesProps } from "@/types/define_props";

const ITEMS_PER_PAGE = 20; 

export default async function CasePage() {
  const allCase = getAllCase();
  const currentPage = 1;
  const startIndex = 0;
  const endIndex = ITEMS_PER_PAGE;
  const paginatedCase = allCase.slice(startIndex, endIndex);

  const Home_header_case: Home_header_casesProps["Home_header_cases"] = {
    title: "Our casestudy",
    subtitle: "Insights, stories, and updates from our team.",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-white">
      <HomeCaseSection
        Home_header_cases={Home_header_case}
        case_data={paginatedCase}
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
