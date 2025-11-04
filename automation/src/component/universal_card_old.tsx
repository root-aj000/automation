import { BlogCardProps } from "@/types/define_props";
// import Image from "next/image";

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}
export const UniversalCard = ({ blog_data }: BlogCardProps) => {
    if (!Array.isArray(blog_data)) {
    console.error("blog_data is not an array:", blog_data);
    return null;
  }
  const blog = Array.isArray(blog_data) ? blog_data : [blog_data];
  console.log("blogdata", blog);

  return (
    <>

      {blog_data.map((blog) => {
        const slug = slugify(blog.title);
        const href = `/blog/${slug}`;

        return (
      <a
        key={slug}
        href={href}
        className="block group cursor-pointer border border-gray-300 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-600 hover:bg-gray-100"
      >
        <div className="flex items-center mb-6">
          {/* <Image
            src={blog.blog_data.image}
            alt={blog.blog_data.title}
            className="rounded-lg w-full object-cover"
          /> */}
        </div>
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
      </a>
    );
    
    })};

    </>
  );
};
