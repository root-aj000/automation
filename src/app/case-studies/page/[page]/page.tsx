import { getAllCase } from "@/utils/CasePage";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Pagination } from "@/component/pagination";
import { notFound } from "next/navigation";

const ITEMS_PER_PAGE = 20;

export async function generateStaticParams() {
  const allCases = getAllCase();
  const totalPages = Math.ceil(allCases.length / ITEMS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function CasePaginationPage(props: {
  params: { page: string } | Promise<{ page: string }>;
}) {
  // ✅ Handle both sync & async params (Next.js 14/15+)
  const { page } = await Promise.resolve(props.params);
  const currentPage = Number(page);

  const allCases = getAllCase();
  const totalPages = Math.ceil(allCases.length / ITEMS_PER_PAGE);

  if (currentPage < 1 || currentPage > totalPages) return notFound();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCase = allCases.slice(startIndex, endIndex);

  console.log({
    total: allCases.length,
    currentPage,
    startIndex,
    endIndex,
    blogs: paginatedCase.map((b) => b.title),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-white">
      <HomeBlogSection
        Home_header_blog={{
          title: "Our Blog",
          subtitle: "Insights, stories, and updates from our team.",
        }}
        blog_data={paginatedCase}
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
