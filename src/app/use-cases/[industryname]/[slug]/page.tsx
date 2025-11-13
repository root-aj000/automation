import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { UsecaseProps } from "@/types/define_props";
import { MDXRemote } from "next-mdx-remote/rsc";
import UseCaseHero from "@/component/use_case_hero";
import BenefitsSection from "@/component/benefits_section";
import ChallengesSection from "@/component/challenges_section";
import ResultsSection from "@/component/results_section";
import ScrollProgressBar from "@/component/scroll";


const USECASE_DIR = path.join(process.cwd(), "content", "use-cases");

export async function generateStaticParams() {
  const industries = fs.readdirSync(USECASE_DIR);
  const params = [];

  for (const industry of industries) {
    const industryPath = path.join(USECASE_DIR, industry);
    if (fs.statSync(industryPath).isDirectory()) {
      const files = fs.readdirSync(industryPath);
      for (const file of files) {
        if (file.endsWith(".mdx")) {
          params.push({
            industryname: industry,
            slug: file.replace(".mdx", ""),
          });
        }
      }
    }
  }

  return params;
}

export default async function UseCasePage({
  params,
}: {
  params: { industryname: string; slug: string };
}) {
  const { industryname, slug } = await params;
  const filepath = path.join(USECASE_DIR, industryname, `${slug}.mdx`);

  if (!fs.existsSync(filepath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(fileContent);
  const { usecase } = data as UsecaseProps;

  return (
    <>
    <ScrollProgressBar />
    <div className="mx-auto max-w-5xl">
      <UseCaseHero
        title={usecase.title}
        description={usecase.description}
        hero_image={usecase.hero_image}
      />
      <BenefitsSection benefits={usecase.benefits} />
      <ChallengesSection challenges={usecase.challenges} />
      <ResultsSection results={usecase.results} />
      <article className="max-w-4xl mx-auto px-4 py-12 prose">
        <MDXRemote source={content} />
      </article>
    </div>
    </>
  );
}
