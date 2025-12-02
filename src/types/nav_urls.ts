export const NAV_URLS = {
  home: "/",
  about: "/about-us",
  contact: "/contact-us",
  blog: "/blogs",
  casestudies: "/case-studies",
  useCases: "/use-cases",
  features: "/features",
  p_cta : "/chat",
  s_cta : "/use-cases",

} as const;

export type NavUrlKey = keyof typeof NAV_URLS;
export type NavUrlValue = (typeof NAV_URLS)[NavUrlKey];
