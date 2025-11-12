import { CaseStudyProps } from "@/types/define_props";
// import Image from "next/image";
import Link from "next/link";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UniversalCardCase = ({ case_data }: CaseStudyProps) => {
  // Handle both array and single object
  const cases = Array.isArray(case_data) ? case_data : [case_data];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((casedata) => {
        const slug = slugify(casedata.title);
        const href = `/case-studies/${slug}`;

        return (
          <Link
            key={slug}
            href={href}
            className="block group cursor-pointer border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-600 hover:bg-gray-100"
          >
            {/* {blog.image && (
              <div className="mb-6">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={600}
                  height={400}
                  className="rounded-lg w-full object-cover"
                />
              </div>
            )} */}

            <div>
              <h4 className="text-gray-900 font-medium leading-8 mb-9">
                {casedata.title}
              </h4>
              <div className="flex items-center justify-between font-medium">
                <h6 className="text-sm text-gray-500">By {casedata.author}</h6>
                <span className="text-sm text-indigo-600">
                  {new Date(casedata.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
