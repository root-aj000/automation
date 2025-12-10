import { IndexProps } from "@/types/define_props";
import { CONTENT_CONFIG } from "@/config/content.config";
import { fetchMdxWithFrontmatter } from "@/services/github-content";

// Default empty data structure
const defaultHomeData: IndexProps["HomePage"] = {
  Hero_1: { mh_line: "", tg_line: "", discription: "", p_cta: "", s_cta: "", image: "", alt: "" },
  Hero_2: { mh_line: "", tg_line: "", discription: "", p_cta: "", s_cta: "", image: "", alt: "" },
  Hero_3: { mh_line: "", tg_line: "", discription: "", p_cta: "", s_cta: "", image: "", alt: "" },
  Hero_4: { mh_line: "", tg_line: "", discription: "", p_cta: "", s_cta: "", image: "", alt: "" },
  logo_cloud: { title: "", logos: [] },
  stats: { heading: "", description: "", items: [] },
  Howitworks: { title: "", subtitle: "", image: "", steps: [] },
  subscribe: { title: "", description: "", placeholder: "", buttonText: "" },
  forwhom: { title: "", description: "", p_cta: "", items: [] },
  list_header: { title: "", discription: "" },
  grid: { title: "", subtitle: "", features: [] },
  blog_data: [],
  case_data: [],
  Home_header_blog: { title: "", subtitle: "" },
  Home_header_cases: { title: "", subtitle: "" },
  // faq: { title: "", description: "", items: [] },
  faq: {
    title: "Frequently Asked Questions",
    description: "Everything you need to know about our managed automation service.",
    items: [
      {
        question: "Do I need technical skills?",
        answer: "No, we handle all the technical implementation. You just describe your process.",
      },
      {
        question: "How much does it cost?",
        answer: "We offer flat-rate pricing based on the number of workflows.",
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we use enterprise-grade encryption and strictly adhere to data privacy standards.",
      },
      {
        question: "Can I cancel anytime?",
        answer: "Yes, our plans are monthly with no long-term commitment required.",
      },
    ],
  },
};

/**
 * Get homepage data from GitHub
 */
export async function getHomeData(): Promise<IndexProps["HomePage"]> {
  try {
    const { data } = await fetchMdxWithFrontmatter<IndexProps["HomePage"]>(
      CONTENT_CONFIG.paths.homepage
    );

    // Merge with defaults to ensure all properties exist
    return {
      ...defaultHomeData,
      ...data,
      // Ensure nested objects have defaults
      Hero_1: { ...defaultHomeData.Hero_1, ...data?.Hero_1 },
      Hero_2: { ...defaultHomeData.Hero_2, ...data?.Hero_2 },
      Hero_3: { ...defaultHomeData.Hero_3, ...data?.Hero_3 },
      Hero_4: { ...defaultHomeData.Hero_4, ...data?.Hero_4 },
      logo_cloud: { ...defaultHomeData.logo_cloud, ...data?.logo_cloud },
      stats: { ...defaultHomeData.stats, ...data?.stats },
      Howitworks: { ...defaultHomeData.Howitworks, ...data?.Howitworks },
      subscribe: { ...defaultHomeData.subscribe, ...data?.subscribe },
      forwhom: { ...defaultHomeData.forwhom, ...data?.forwhom },
      Home_header_blog: { ...defaultHomeData.Home_header_blog, ...data?.Home_header_blog },
      Home_header_cases: { ...defaultHomeData.Home_header_cases, ...data?.Home_header_cases },
      faq: {
        title: data?.faq?.title ?? defaultHomeData.faq!.title,
        description: data?.faq?.description ?? defaultHomeData.faq!.description,
        items: data?.faq?.items ?? defaultHomeData.faq!.items,
      },
    };
  } catch (error) {
    console.error("Failed to fetch homepage data from GitHub:", error);
    return defaultHomeData;
  }
}