import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { IndexProps } from "@/types/define_props";

const filepath = path.join(process.cwd(), "content", "main", "homepage.mdx");
// console.log("Filepath:", filepath);
const file = fs.readFileSync(filepath, "utf-8");
const { data } = matter(file);
const HomeData = data as IndexProps["HomePage"];
// console.log("path", filepath);


const blog_url = (filepath.replace(/\\/g, "/").split("/").pop() ?? "").replace(
  ".mdx",
  ""
);

console.log(blog_url);
export { HomeData, blog_url};