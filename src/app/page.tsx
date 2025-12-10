import type { Metadata } from "next";
import { getAllBlogs } from "@/utils/BlogPage";
import { Hero_1 } from "@/component/hero_1";
import { Hero_2 } from "@/component/hero_2";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Feature } from "@/component/feature";
import { Hero_3 } from "@/component/hero_3";
import { getHomeData } from "@/utils/homepage";
import { getFeatureData } from "@/utils/FeatureBlock";
import { HomeCaseSection } from "@/component/home_case_section";
import { getAllCase } from "@/utils/CasePage";
import { getIndustries } from "@/utils/use-cases";
import { UseCaseCard } from "@/component/use-case";
import { Hero_4 } from "@/component/hero_4";
import { Stats } from "@/component/stats";
import { LogoCloud } from "@/component/logo_cloud";
import { Subscribe } from "@/component/subscribe";
import { Steps } from "@/component/steps";
import { ForWhom } from "@/component/for_whom";
import { Faq } from "@/component/faq";

export const metadata: Metadata = {
  title: "Home",
  description: "AI-powered automation tools to streamline your workflows and boost productivity. Build smarter with next-gen automation.",
  openGraph: {
    title: "AJ Automation - Build Smarter with AI",
    description: "AI-powered automation tools to streamline your workflows and boost productivity.",
  },
};

export default async function HomePage() {
  // Fetch all content from GitHub (with local fallback)
  const [homeData, featureData, blogData, caseData, industries] = await Promise.all([
    getHomeData(),
    getFeatureData(),
    getAllBlogs(),
    getAllCase(),
    getIndustries(),
  ]);

  const blog_data = blogData.slice(0, 3);
  const case_data = caseData.slice(0, 3);

  return (
    <>
      <Hero_1 Hero_1={homeData.Hero_1} />
      <LogoCloud logo_cloud={homeData.logo_cloud} />
      <Feature grid={featureData.grid} />
      <Hero_2 Hero_2={homeData.Hero_2} />
      <UseCaseCard usecase_data={industries} />
      <Stats stats={homeData.stats} />
      <Hero_3 Hero_3={homeData.Hero_3} />
      <HomeCaseSection
        Home_header_cases={homeData.Home_header_cases}
        case_data={case_data}
      />
      <Hero_4 Hero_4={homeData.Hero_4} />
      <HomeBlogSection
        Home_header_blog={homeData.Home_header_blog}
        blog_data={blog_data}
      />
      <Steps Howitworks={homeData.Howitworks} />
      <ForWhom forwhom={homeData.forwhom} />
      <Faq faq={homeData.faq ?? { title: "", description: "", items: [] }} />
      <Subscribe subscribe={homeData.subscribe} />
    </>
  );
}
