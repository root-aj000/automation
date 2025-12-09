import { CONTENT_CONFIG } from "@/config/content.config";
import { listDirectory, fetchMdxWithFrontmatter } from "@/services/github-content";

interface IndustryUseCases {
  industry: string;
  useCases: Record<string, unknown>[];
}

interface Industry {
  title: string;
  icon: string;
}

const DEFAULT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
</svg>`;

/**
 * Get use cases by industry from GitHub
 */
export async function getUseCasesByIndustry(): Promise<IndustryUseCases[]> {
  try {
    const directories = await listDirectory(CONTENT_CONFIG.paths.useCases);
    const industryDirs = directories.filter((item) => item.type === "dir");

    const results = await Promise.all(
      industryDirs.map(async (dir) => {
        const files = await listDirectory(dir.path);
        const mdxFiles = files.filter(
          (file) => file.type === "file" && file.name.endsWith(".mdx")
        );

        const useCases = await Promise.all(
          mdxFiles.map(async (file) => {
            const { data } = await fetchMdxWithFrontmatter(file.path);
            return data;
          })
        );

        return {
          industry: dir.name,
          useCases,
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Failed to fetch use cases from GitHub:", error);
    return [];
  }
}

/**
 * Get industries from GitHub
 */
export async function getIndustries(): Promise<Industry[]> {
  try {
    const directories = await listDirectory(CONTENT_CONFIG.paths.useCases);

    return directories
      .filter((item) => item.type === "dir")
      .map((dir) => ({
        title: dir.name,
        icon: DEFAULT_ICON,
      }));
  } catch (error) {
    console.error("Failed to fetch industries from GitHub:", error);
    return [];
  }
}