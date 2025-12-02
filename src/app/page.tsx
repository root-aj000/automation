import { getAllBlogs } from "@/utils/BlogPage";
import { Hero_1 } from "@/component/hero_1";
import { Hero_2 } from "@/component/hero_2";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Feature } from "@/component/feature";
import { Hero_3 } from "@/component/hero_3";
import { HomeData } from "@/utils/homepage";
import { FeatureData } from "@/utils/FeatureBlock";
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


const blog_data = getAllBlogs().slice(0, 4);
const case_data = getAllCase().slice(0, 4);
const industries = getIndustries();

export default async function HomePage() {
  return (
    <>

      <Hero_1 Hero_1={HomeData.Hero_1} />
      <LogoCloud logo_cloud={HomeData.logo_cloud} />
      <Feature grid={FeatureData.grid} />
      <Hero_2 Hero_2={HomeData.Hero_2} />
      <UseCaseCard usecase_data={industries} />
      <Stats stats={HomeData.stats} />
      <Hero_3 Hero_3={HomeData.Hero_3} />
      <HomeCaseSection
        Home_header_cases={HomeData.Home_header_cases}
        case_data={case_data}
      />
      <Hero_4 Hero_4={HomeData.Hero_4} />
      <HomeBlogSection
        Home_header_blog={HomeData.Home_header_blog}
        blog_data={blog_data}
      />
      <Steps Howitworks={HomeData.Howitworks} />
      <ForWhom forwhom={HomeData.forwhom} />
      <Subscribe subscribe={HomeData.subscribe} />

    </>
  );
};
