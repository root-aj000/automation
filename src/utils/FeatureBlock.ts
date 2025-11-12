import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { FeatureGridProps} from "@/types/define_props";

const filepath = path.join(process.cwd(), "content", "main", "features.mdx");
// console.log("Filepath:", filepath);
const file = fs.readFileSync(filepath, "utf-8");
const { data } = matter(file);
const FeatureData = data as FeatureGridProps;
// console.log("path", filepath);
 export { FeatureData };