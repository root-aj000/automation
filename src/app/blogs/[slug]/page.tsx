import fs from "fs";
import path from "path";
import matter from "gray-matter";
// import Image from "next/image";
// import { notFound } from "next/navigation";
import { Blogitem } from "@/types/define_props";
import { MDXRemote } from "next-mdx-remote/rsc"; // if you’re using MDX

const BLOG_DIR = path.join(process.cwd(), "content", "post");

export async function generateStaticParams() {
  const files = fs.readdirSync(BLOG_DIR);
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
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`);

  // if (!fs.existsSync(filepath)) {
  //   return notFound();
  // }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(fileContent);
  const blog = data as Blogitem;

  return (
    <>
      <div className="bg-white py-6 sm:py-8 lg:py-12 mb-24">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 fixed">
            <div className="bg-gray-600 h-2.5 rounded-full"></div>{" "}
            {/* style="width: 0%" */}
          </div>

          <div className="mx-auto w-full max-w-screen-lg px-6 py-16">
            <h1 className="lg:text-5xl text-3xl">{blog.title}</h1>
          </div>

          <section className="bg-white">
            <div className="py-3 px-4 mx-auto max-w-screen-lg text-center">
              <div className="flex flex-row justify-between text-gray-700">
                <span className="flex px-6 text-base font-medium">
                  {" "}
                  Author: {blog.author}
                </span>
                <span className="px-6 font-medium">
                  {" "}
                  date:{" "}
                  {new Date(blog.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                </span>
              </div>
            </div>
          </section>

          <hr className="w-96 h-0.5 mx-auto my-0 bg-[#ff4f1f] border-0 rounded" />

          <div className="bg-white py-6 sm:py-8 lg:py-12 mb-24">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <MDXRemote source={content} />
            </div>
          </div>

          {/* <figure className="max-w-lg mx-auto px-6 py-6">
        <Image
          className="h-auto max-w-full rounded-lg"
          src={data.src}
          alt={data.alt}
          loading="lazy"
        />
        <figcaption className="mt-2 text-sm text-center text-gray-700">
          {data.caption}
        </figcaption>
      </figure> */}

          <hr className="w-1/2 h-0.5 mx-auto my-1 bg-[#ff4f1f] border-0 rounded" />
        </div>
      </div>
    </>
  );
}
