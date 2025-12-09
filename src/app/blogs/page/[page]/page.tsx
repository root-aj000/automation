import type { Metadata } from "next";
import { getAllBlogs } from "@/utils/BlogPage";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Pagination } from "@/component/pagination";
import { notFound } from "next/navigation";

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore our latest articles, insights, and updates on automation, AI, and productivity.",
  openGraph: {
    title: "Blog | AJ Automation",
    description: "Explore our latest articles, insights, and updates on automation, AI, and productivity.",
  },
};

export default async function BlogPaginationPage(props: {
  params: { page: string } | Promise<{ page: string }>;
}) {
  const { page } = await Promise.resolve(props.params);
  const currentPage = Number(page);

  // Fetch from GitHub
  const allBlogs = await getAllBlogs();
  const totalPages = Math.ceil(allBlogs.length / ITEMS_PER_PAGE);

  if (allBlogs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">No blogs found</h1>
        <p className="text-muted">Check your GitHub configuration.</p>
      </div>
    );
  }

  if (currentPage < 1 || currentPage > totalPages) return notFound();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBlogs = allBlogs.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <HomeBlogSection
        Home_header_blog={{
          title: "Our Blog",
          subtitle: "Insights, stories, and updates from our team.",
        }}
        blog_data={paginatedBlogs}
      />
      <Pagination
        currentPage={currentPage}
        totalItems={allBlogs.length}
        itemsPerPage={ITEMS_PER_PAGE}
        basePath="/blogs"
      />
    </div>
  );
}
