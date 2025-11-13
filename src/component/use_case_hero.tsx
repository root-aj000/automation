import Image from "next/image";

interface UseCaseHeroProps {
  title: string;
  description: string;
  hero_image: string;
}

export default function UseCaseHero({
  title,
  description,
  hero_image,
}: UseCaseHeroProps) {
  return (
    <div className="relative ">
      <div className="absolute inset-0">
        <Image
          className="w-full h-full object-cover"
          src={hero_image}
          alt={title}
          width={1600}
          height={900}
        />
        <div
          className="absolute inset-0  mix-blend-multiply"
          aria-hidden="true"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight  sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 text-xl  max-w-3xl">{description}</p>
      </div>
    </div>
  );
}
