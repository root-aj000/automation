import { FeatureGridProps } from "@/types/define_props";
import { CONTENT_CONFIG } from "@/config/content.config";
import { fetchMdxWithFrontmatter } from "@/services/github-content";

/**
 * Get feature data from GitHub
 */
export async function getFeatureData(): Promise<FeatureGridProps> {
    try {
        const { data } = await fetchMdxWithFrontmatter<FeatureGridProps>(
            CONTENT_CONFIG.paths.features
        );
        return data;
    } catch (error) {
        console.error("Failed to fetch feature data from GitHub:", error);
        // Return empty/default data structure matching FeatureGridProps
        return {
            grid: {
                title: "",
                subtitle: "",
                features: [],
            },
        };
    }
}