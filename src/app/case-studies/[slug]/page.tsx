import fs from "fs";
import path from "path";
import matter from "gray-matter";
// import { notFound } from "next/navigation";
import { Blogitem } from "@/types/define_props";
import { MDXRemote } from "next-mdx-remote/rsc"; // if you’re using MDX

const CASE_DIR = path.join(process.cwd(), "content", "case");

export async function generateStaticParams() {
  const files = fs.readdirSync(CASE_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((filename) => ({
      slug: filename.replace(".mdx", ""),
    }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const filepath = path.join(CASE_DIR, `${slug}.mdx`);

  // if (!fs.existsSync(filepath)) {
  //   return notFound();
  // }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(fileContent);
  const blog = data as Blogitem;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 prose">
      <h1>{blog.title}</h1>
      <p className="text-sm text-gray-500">
        By {blog.author} • {blog.date}
      </p>
      {/* {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full rounded-lg my-6"
        />
      )} */}
      <MDXRemote source={content} />
    </article>
  );
}
