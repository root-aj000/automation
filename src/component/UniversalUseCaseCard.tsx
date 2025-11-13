import { UniversalUseCaseCardProps } from "@/types/define_props";
import Link from "next/link";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UniversalUseCaseCard = ({ usecase_data, industryname }: UniversalUseCaseCardProps) => {
  const usecases = Array.isArray(usecase_data) ? usecase_data : [usecase_data];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {usecases.map((usecase) => {
        const slug = slugify(usecase.title);
        const href = `/use-cases/${industryname}/${slug}`;

        return (
          <Link
            key={slug}
            href={href}
            className="block group cursor-pointer border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-600 hover:bg-gray-100"
          >
            <div>
              <h4 className="text-gray-900 font-medium leading-8 mb-4">
                {usecase.title}
              </h4>
              <p className="text-gray-600 text-sm">
                {usecase.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
