import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { UseCaseCardprops } from "@/types/define_props";

const useCasesDirectory = path.join(process.cwd(), "content", "use-cases");

export function getUseCasesByIndustry() {
  const industries = fs.readdirSync(useCasesDirectory);

  return industries.map((industry) => {
    const industryPath = path.join(useCasesDirectory, industry);
    const files = fs.readdirSync(industryPath);

    const useCases = files.map((file) => {
      const filePath = path.join(industryPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return data;
    });

    return {
      industry,
      useCases,
    };
  });
}

export function getIndustries() {
  const industries = fs.readdirSync(useCasesDirectory);
  return industries.map((industry) => ({
    title: industry,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
</svg>
`,
  }));
}

// const filepath = path.join(process.cwd(), "content", "main", "use-cases.mdx");
// // console.log("Filepath:", filepath);
// const file = fs.readFileSync(filepath, "utf-8");
// const { data } = matter(file);
// const UseCaseData = data as UseCaseCardprops;
// // console.log("path", filepath);
//  export { UseCaseData };