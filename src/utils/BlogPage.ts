import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Blogitem } from "@/types/define_props";

// Get absolute path to /content/post
const BLOG_DIR = path.join(process.cwd(), "content", "post");

export function getAllBlogs(): Blogitem[] {
  if (!fs.existsSync(BLOG_DIR)) {
    console.warn(`Blog directory not found: ${BLOG_DIR}`);
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);

  const blogs: Blogitem[] = files
    .filter((file) => file.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        title: data.title || "",
        author: data.author || "",
        contentType: data.contentType || "Blog",
        serviceName: data.serviceName || "",
        date: data.date || "",
        image: data.image || "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        category: data.category || "",
        href: `/blogs/${filename.replace(".mdx", "")}`,
      };
    });

  // Sort by newest date
  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
