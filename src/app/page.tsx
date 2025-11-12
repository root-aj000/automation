import { getAllBlogs } from "@/utils/BlogPage";
import { Hero_1 } from "@/component/hero_1";
import { Hero_2 } from "@/component/hero_2";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Feature } from "@/component/feature";
// import { Hero_3 } from "@/component/hero_3";
import {HomeData} from "@/utils/homepage";
import { FeatureData } from "@/utils/FeatureBlock";
import { HomeCaseSection } from "@/component/home_case_section";
import { getAllCase } from "@/utils/CasePage";
// import {UseCaseData} from "@/utils/use-cases";
//  import { UseCaseCard } from "@/component/use-case";
const blog_data = getAllBlogs().slice(0, 4);
const case_data = getAllCase().slice(0, 4);

export default async function HomePage() {
  return (
    <>
      <Hero_1 Hero_1={HomeData.Hero_1} />
      <Hero_2 Hero_2={HomeData.Hero_2} />
      <HomeBlogSection
        Home_header_blog={HomeData.Home_header_blog}
        blog_data={blog_data}
      />
      <HomeCaseSection
        Home_header_cases={HomeData.Home_header_cases}
        case_data={case_data}
      />
      {/* <Hero_3 Hero_3 ={HomeData.Hero_3} /> */}
      <Feature grid={FeatureData.grid} />
      {/* <UseCaseCard usecase_data={UseCaseData.usecase_data} /> */}
    </>
  );
};
