import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Hero_1 } from "@/component/hero_1";
import { IndexProps } from "@/types/define_props";
import { Hero_2 } from "@/component/hero_2";
import { HomeBlogSection } from "@/component/home_blog_section";
import { Hero_3 } from "@/component/hero_3";

export default async function HomePage() {
  const filepath = path.join(process.cwd(), "content", "main", "homepage.mdx");
  // console.log("Filepath:", filepath);
  const file = fs.readFileSync(filepath, "utf-8");
  const { data } = matter(file);
  const HomeData = data as IndexProps["HomePage"];
  // console.log("path", filepath);
  
  
  const blog_url = (
    filepath.replace(/\\/g, "/").split("/").pop() ?? ""
  ).replace(".mdx", "");

  // console.log(blog_url);

  return (
    <>
      <Hero_1 Hero_1={HomeData.Hero_1} />
      <Hero_2 Hero_2={HomeData.Hero_2} />
      <HomeBlogSection
        Home_header_blog={HomeData.Home_header_blog}
        blog_data={HomeData.blog_data}
      />
      {/* <Hero_3 Hero_3 ={HomeData.Hero_3} /> */}
    </>
  );
}
