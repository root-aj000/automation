import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { FeatureProps } from "@/types/define_props";
import { MDXRemote } from "next-mdx-remote/rsc";

const FEATURE_DIR = path.join(process.cwd(), "content", "feature");

export async function generateStaticParams() {
  const files = fs.readdirSync(FEATURE_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((filename) => ({
      slug: filename.replace(".mdx", ""),
    }));
}

export default async function FeaturePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const filepath = path.join(FEATURE_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filepath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(fileContent);
  const { features: feature } = data as FeatureProps;

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 prose">
      <h1>{feature.title}</h1>
      <p className="text-lg text-gray-600">{feature.description}</p>
      <MDXRemote source={content} />
    </article>
  );
}
