import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { UseCaseCardprops} from "@/types/define_props";

const filepath = path.join(process.cwd(), "content", "main", "use-cases.mdx");
// console.log("Filepath:", filepath);
const file = fs.readFileSync(filepath, "utf-8");
const { data } = matter(file);
const UseCaseData = data as UseCaseCardprops;
// console.log("path", filepath);
 export { UseCaseData };