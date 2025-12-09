import type { Metadata } from "next";
import { getAllCase } from "@/utils/CasePage";
import { HomeCaseSection } from "@/component/home_case_section";
import { Pagination } from "@/component/pagination";
import { notFound } from "next/navigation";

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Explore our success stories and see how we've helped businesses transform with automation.",
  openGraph: {
    title: "Case Studies | AJ Automation",
    description: "Explore our success stories and see how we've helped businesses transform with automation.",
  },
};

export default async function CasePaginationPage(props: {
  params: { page: string } | Promise<{ page: string }>;
}) {
  const { page } = await Promise.resolve(props.params);
  const currentPage = Number(page);

  // Fetch from GitHub
  const allCases = await getAllCase();
  const totalPages = Math.ceil(allCases.length / ITEMS_PER_PAGE);

  if (allCases.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No case studies found</h1>
        <p className="text-muted">Check your GitHub configuration.</p>
      </div>
    );
  }

  if (currentPage < 1 || currentPage > totalPages) return notFound();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCase = allCases.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <HomeCaseSection
        Home_header_cases={{
          title: "Case Studies",
          subtitle: "Success stories and insights from our projects.",
        }}
        case_data={paginatedCase}
      />
      <Pagination
        currentPage={currentPage}
        totalItems={allCases.length}
        itemsPerPage={ITEMS_PER_PAGE}
        basePath="/case-studies"
      />
    </div>
  );
}
