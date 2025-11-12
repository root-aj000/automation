import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CaseStudyItem } from "@/types/define_props";

// Get absolute path to /content/post
const CASE_DIR = path.join(process.cwd(), "content", "case-studies");

export function getAllCase(): CaseStudyItem[] {
  if (!fs.existsSync(CASE_DIR)) {
    console.warn(`Blog directory not found: ${CASE_DIR}`);
    return [];
  }

  const files = fs.readdirSync(CASE_DIR);

  const cases: CaseStudyItem[] = files
    .filter((file) => file.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(CASE_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        title: data.title || "",
        author: data.author || "",
        contentType: data.contentType || "Case-Study",
        serviceName: data.serviceName || "",
        date: data.date || "",
        image: data.image || "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        category: data.category || "",
        href: `/case-studies/${filename.replace(".mdx", "")}`,
      };
    });

  // Sort by newest date
  return cases.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
