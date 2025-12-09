/**
 * GitHub Content Service
 * 
 * Fetches content from GitHub repository with caching support.
 * Requires GITHUB_TOKEN environment variable for private repos.
 */

import matter from "gray-matter";
import { CONTENT_CONFIG, getGitHubRawUrl, getGitHubApiUrl } from "@/config/content.config";

interface GitHubFile {
    name: string;
    path: string;
    type: "file" | "dir";
    download_url: string | null;
}

interface FetchOptions {
    cache?: RequestCache;
    revalidate?: number;
}

/**
 * Get authorization headers for GitHub API
 */
function getHeaders(): HeadersInit {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.warn("GITHUB_TOKEN not set - private repos will fail");
        return {
            "Accept": "application/vnd.github.v3+json",
        };
    }
    return {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": `Bearer ${token}`,
    };
}

/**
 * Fetch raw file content from GitHub
 */
export async function fetchFile(
    path: string,
    options?: FetchOptions
): Promise<string> {
    const url = getGitHubRawUrl(path);

    const response = await fetch(url, {
        headers: getHeaders(),
        next: {
            revalidate: options?.revalidate ?? CONTENT_CONFIG.revalidate,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
    }

    return response.text();
}

/**
 * List files in a GitHub directory
 */
export async function listDirectory(
    path: string,
    options?: FetchOptions
): Promise<GitHubFile[]> {
    const url = getGitHubApiUrl(path);

    const response = await fetch(url, {
        headers: getHeaders(),
        next: {
            revalidate: options?.revalidate ?? CONTENT_CONFIG.revalidate,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to list ${path}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

/**
 * Fetch and parse MDX file with frontmatter
 */
export async function fetchMdxWithFrontmatter<T = Record<string, unknown>>(
    path: string,
    options?: FetchOptions
): Promise<{ data: T; content: string }> {
    const raw = await fetchFile(path, options);
    const { data, content } = matter(raw);
    return { data: data as T, content };
}

/**
 * List MDX files in a directory and fetch their frontmatter
 */
export async function listMdxFiles<T = Record<string, unknown>>(
    directoryPath: string,
    options?: FetchOptions
): Promise<Array<{ filename: string; data: T; content: string }>> {
    const files = await listDirectory(directoryPath, options);

    const mdxFiles = files.filter(
        (file) => file.type === "file" && file.name.endsWith(".mdx")
    );

    const results = await Promise.all(
        mdxFiles.map(async (file) => {
            const { data, content } = await fetchMdxWithFrontmatter<T>(file.path, options);
            return {
                filename: file.name,
                data,
                content,
            };
        })
    );

    return results;
}

/**
 * Get content with local fallback support
 */
export async function fetchWithFallback<T>(
    fetchFn: () => Promise<T>,
    localFallbackFn: () => T
): Promise<T> {
    if (!CONTENT_CONFIG.useLocalFallback) {
        return fetchFn();
    }

    try {
        return await fetchFn();
    } catch (error) {
        console.warn("GitHub fetch failed, using local fallback:", error);
        return localFallbackFn();
    }
}
