import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { UniversalUseCaseCard } from "@/component/UniversalUseCaseCard";
import { UniversalUseCaseItem } from "@/types/define_props";

const USECASE_DIR = path.join(process.cwd(), "content", "use-cases");

export async function generateStaticParams() {
  const industries = fs.readdirSync(USECASE_DIR);
  return industries.map((industry) => ({
    industryname: industry,
  }));
}

export default async function IndustryPage({
  params,
}: {
  params: { industryname: string };
}) {
  const { industryname } = await params;
  const industryPath = path.join(USECASE_DIR, industryname);

  if (!fs.existsSync(industryPath) || !fs.statSync(industryPath).isDirectory()) {
    return notFound();
  }

  const files = fs.readdirSync(industryPath);
  const useCases: UniversalUseCaseItem[] = [];

  for (const file of files) {
    if (file.endsWith(".mdx")) {
      const filepath = path.join(industryPath, file);
      const fileContent = fs.readFileSync(filepath, "utf-8");
      const { data } = matter(fileContent);
      useCases.push({
        title: data.usecase.title,
        description: data.usecase.description,
        href: `/use-cases/${industryname}/${file.replace(".mdx", "")}`,
      });
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">{industryname} Use Cases</h1>
      <UniversalUseCaseCard usecase_data={useCases} industryname={industryname} />
    </div>
  );
}
