/**
 * Content Configuration
 * 
 * Centralized configuration for GitHub content fetching.
 * Update GITHUB_REPO_URL to point to your content repository.
 */

export const CONTENT_CONFIG = {
    // ============================================
    // CHANGE THIS URL TO YOUR GITHUB REPOSITORY
    // ============================================
    github: {
        owner: "root-aj000",     // e.g., "repo"
        repo: "content-repo",            // e.g., "automation-content"
        branch: "master",                     // Branch to fetch from
    },

    // Content paths within the repository
    paths: {
        blogs: "content/post",
        caseStudies: "content/case-studies",
        homepage: "content/main/homepage.mdx",
        features: "content/main/features.mdx",
        featureItems: "content/feature",
        useCases: "content/use-cases",
    },

    // Cache revalidation time in seconds (for ISR)
    revalidate: 3600, // 1 hour

    // Use local fallback if GitHub fetch fails
    useLocalFallback: true,
} as const;

/**
 * Get the raw GitHub URL for a file
 */
export function getGitHubRawUrl(path: string): string {
    const { owner, repo, branch } = CONTENT_CONFIG.github;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/**
 * Get the GitHub API URL for listing directory content
 */
export function getGitHubApiUrl(path: string): string {
    const { owner, repo, branch } = CONTENT_CONFIG.github;
    // return `https://api.github.com/repos/${owner}/${repo}/content/${path}`;
    return `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
}

export type ContentConfig = typeof CONTENT_CONFIG;
