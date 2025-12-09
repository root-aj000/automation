/**
 * Site Configuration
 * 
 * Centralized site metadata and configuration.
 * Update these values to customize your site's SEO and branding.
 */

export const siteConfig = {
    name: "AJ Automation",
    description: "AI-powered automation tools to streamline your workflows and boost productivity.",
    url: "https://aj-automation.com", // Update with your actual domain
    ogImage: "/og-image.png",

    // Social links
    links: {
        twitter: "https://twitter.com/aj_automation",
        github: "https://github.com/root-aj000",
        linkedin: "https://linkedin.com/company/aj-automation",
    },

    // Default metadata for pages
    defaultMeta: {
        keywords: ["automation", "AI", "workflow", "productivity", "tools", "business"],
        authors: [{ name: "AJ Automation Team" }],
        creator: "AJ Automation",
        publisher: "AJ Automation",
    },
} as const;

export type SiteConfig = typeof siteConfig;
