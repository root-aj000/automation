import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UniversalUseCaseCard } from "@/component/UniversalUseCaseCard";
import { UniversalUseCaseItem } from "@/types/define_props";
import { CONTENT_CONFIG } from "@/config/content.config";
import { listDirectory, fetchMdxWithFrontmatter } from "@/services/github-content";

type Props = {
  params: { industryname: string };
};

// Helper to find the actual directory name (case-insensitive match)
async function findIndustryDir(industryname: string): Promise<string | null> {
  try {
    const directories = await listDirectory(CONTENT_CONFIG.paths.useCases);
    const targetIndustry = industryname.toLowerCase();

    const matchingDir = directories.find(
      (dir) => dir.type === "dir" && dir.name.toLowerCase() === targetIndustry
    );

    return matchingDir ? matchingDir.name : null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const directories = await listDirectory(CONTENT_CONFIG.paths.useCases);
    return directories
      .filter((item) => item.type === "dir")
      .map((dir) => ({
        industryname: dir.name.toLowerCase(),
      }));
  } catch (error) {
    console.error("Failed to generate industry params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industryname } = await params;
  const title = industryname.charAt(0).toUpperCase() + industryname.slice(1).replace(/-/g, ' ');

  return {
    title: `${title} Use Cases`,
    description: `Explore automation use cases for ${title}`,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industryname } = await params;

  try {
    // Find actual directory name (handles case differences)
    const actualIndustryName = await findIndustryDir(industryname);

    if (!actualIndustryName) {
      return notFound();
    }

    const files = await listDirectory(`${CONTENT_CONFIG.paths.useCases}/${actualIndustryName}`);
    const mdxFiles = files.filter((file) => file.type === "file" && file.name.endsWith(".mdx"));

    if (mdxFiles.length === 0) {
      return notFound();
    }

    const useCases: UniversalUseCaseItem[] = [];

    for (const file of mdxFiles) {
      try {
        const { data } = await fetchMdxWithFrontmatter<{ usecase: { title: string; description: string } }>(
          `${CONTENT_CONFIG.paths.useCases}/${actualIndustryName}/${file.name}`
        );
        useCases.push({
          title: data.usecase?.title || file.name,
          description: data.usecase?.description || "",
          href: `/use-cases/${industryname}/${file.name.replace(".mdx", "").toLowerCase()}`,
        });
      } catch (e) {
        console.error(`Failed to fetch ${file.name}:`, e);
      }
    }

    const displayName = actualIndustryName.charAt(0).toUpperCase() + actualIndustryName.slice(1).replace(/-/g, ' ');

    return (
      <div className="py-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Industry
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {displayName} Use Cases
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover how our automation platform transforms {displayName.toLowerCase()} operations
          </p>
        </div>
        <UniversalUseCaseCard usecase_data={useCases} industryname={industryname} />
      </div>
    );
  } catch (error) {
    console.error("Failed to load industry page:", error);
    return notFound();
  }
}
