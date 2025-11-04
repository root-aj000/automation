import { BlogCardProps } from "@/types/define_props";
// import Image from "next/image";
import Link from "next/link";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const UniversalCard = ({ blog_data }: BlogCardProps) => {
  // Handle both array and single object
  const blogs = Array.isArray(blog_data) ? blog_data : [blog_data];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => {
        // console.log("blog_data:", blog_data);

        // const { title, author, date, image, tags, category } = blog_data;
        const slug = slugify(blog.title);
        const href = `/blogs/${slug}`;

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
                {blog.title}
              </h4>
              <div className="flex items-center justify-between font-medium">
                <h6 className="text-sm text-gray-500">By {blog.author}</h6>
                <span className="text-sm text-indigo-600">
                  {new Date(blog.date).toLocaleDateString(undefined, {
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
