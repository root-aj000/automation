import { Blogitem } from "@/types/define_props";
import { CONTENT_CONFIG } from "@/config/content.config";
import { listMdxFiles } from "@/services/github-content";

/**
 * Get all blogs from GitHub
 */
export async function getAllBlogs(): Promise<Blogitem[]> {
  try {
    const files = await listMdxFiles<Blogitem>(CONTENT_CONFIG.paths.blogs);

    const blogs: Blogitem[] = files.map(({ filename, data }) => ({
      title: data.title || "",
      author: data.author || "",
      contentType: data.contentType || "Blog",
      serviceName: data.serviceName || "",
      date: data.date || "",
      image: data.image || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      category: data.category || "",
      href: `/blogs/${filename.replace(".mdx", "")}`,
    }));

    return blogs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch blogs from GitHub:", error);
    return [];
  }
}

/**
 * Get a single blog post content from GitHub
 */
export async function getBlogBySlug(slug: string): Promise<{ data: Blogitem; content: string } | null> {
  try {
    const { fetchMdxWithFrontmatter } = await import("@/services/github-content");
    const result = await fetchMdxWithFrontmatter<Blogitem>(
      `${CONTENT_CONFIG.paths.blogs}/${slug}.mdx`
    );
    return result;
  } catch (error) {
    console.error(`Failed to fetch blog ${slug} from GitHub:`, error);
    return null;
  }
}

/**
 * Get all blog slugs for static generation
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const { listDirectory } = await import("@/services/github-content");
    const files = await listDirectory(CONTENT_CONFIG.paths.blogs);
    return files
      .filter((file) => file.type === "file" && file.name.endsWith(".mdx"))
      .map((file) => file.name.replace(".mdx", ""));
  } catch (error) {
    console.error("Failed to fetch blog slugs from GitHub:", error);
    return [];
  }
}
