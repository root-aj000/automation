import { CaseStudyItem } from "@/types/define_props";
import { CONTENT_CONFIG } from "@/config/content.config";
import { listMdxFiles } from "@/services/github-content";

/**
 * Get all case studies from GitHub
 */
export async function getAllCase(): Promise<CaseStudyItem[]> {
  try {
    const files = await listMdxFiles<CaseStudyItem>(CONTENT_CONFIG.paths.caseStudies);

    const cases: CaseStudyItem[] = files.map(({ filename, data }) => ({
      title: data.title || "",
      author: data.author || "",
      contentType: data.contentType || "Case-Study",
      serviceName: data.serviceName || "",
      date: data.date || "",
      image: data.image || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      category: data.category || "",
      href: `/case-studies/${filename.replace(".mdx", "")}`,
    }));

    return cases.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch case studies from GitHub:", error);
    return [];
  }
}

/**
 * Get a single case study content from GitHub
 */
export async function getCaseBySlug(slug: string): Promise<{ data: CaseStudyItem; content: string } | null> {
  try {
    const { fetchMdxWithFrontmatter } = await import("@/services/github-content");
    const result = await fetchMdxWithFrontmatter<CaseStudyItem>(
      `${CONTENT_CONFIG.paths.caseStudies}/${slug}.mdx`
    );
    return result;
  } catch (error) {
    console.error(`Failed to fetch case study ${slug} from GitHub:`, error);
    return null;
  }
}

/**
 * Get all case study slugs for static generation
 */
export async function getAllCaseSlugs(): Promise<string[]> {
  try {
    const { listDirectory } = await import("@/services/github-content");
    const files = await listDirectory(CONTENT_CONFIG.paths.caseStudies);
    return files
      .filter((file) => file.type === "file" && file.name.endsWith(".mdx"))
      .map((file) => file.name.replace(".mdx", ""));
  } catch (error) {
    console.error("Failed to fetch case study slugs from GitHub:", error);
    return [];
  }
}
