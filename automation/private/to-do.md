Perfect 👍 You’ve already got a solid `define_props.ts` setup — it defines all your data structures for a **static Next.js + MDX** site.

Let’s walk through **the next steps** you mentioned:

1. **Use these props in components (e.g. Hero_1, Hero_2, etc.)**
2. **Connect them in your `page.tsx` (the homepage)**
3. **Load your MDX data** (if you’re sourcing the content from `.mdx` files)

---

## 🧩 1. Example Component (`component/hero_1.tsx`)

You already defined `Hero_1Props`, so you can now use it like this:

```tsx
// component/hero_1.tsx
"use client";
import Image from "next/image";
import { Hero_1Props } from "@/types/define_props";

export default function Hero_1({ Hero_1 }: Hero_1Props) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">{Hero_1.mh_line}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{Hero_1.tg_line}</h2>
          <p className="mb-6 text-gray-700">{Hero_1.discription}</p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold"
            >
              {Hero_1.p_cta}
            </a>
            <a
              href="#"
              className="border border-blue-600 text-blue-600 px-5 py-3 rounded-lg font-semibold"
            >
              {Hero_1.s_cta}
            </a>
          </div>
        </div>
        <div className="relative w-full h-80">
          <Image
            src={Hero_1.image}
            alt={Hero_1.alt}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
```

---

## 🏠 2. Homepage (`app/page.tsx`)

You’ll import your static MDX data and pass it into components.
Let’s assume you’re using MDX via `next-mdx-remote/rsc` or simple JSON imports for now.

```tsx
// app/page.tsx
import Hero_1 from "@/component/hero_1";
import Hero_2 from "@/component/hero_2";
import LogoCloud from "@/component/logo_cloud";
import { IndexProps } from "@/types/define_props";
import data from "@/content/homepage.mdx"; // or .json, depending on your setup

export default function HomePage() {
  const HomeData = (data as IndexProps["HomePage"]);

  return (
    <main>
      <Hero_1 Hero_1={HomeData.Hero_1} />
      <LogoCloud logo_cloud={HomeData.logo_cloud} />
      <Hero_2 Hero_2={HomeData.Hero_2} />
      {/* Add the rest of your sections */}
    </main>
  );
}
```

If you’re using MDX, you can serialize frontmatter from `.mdx` into JSON-like objects using `gray-matter` or `next-mdx-remote`.

---

## 📦 3. Example MDX Data File (`content/homepage.mdx`)

If your static data lives in MDX:

```mdx
---
Hero_1:
  mh_line: "Build Smarter with AI"
  tg_line: "Next-gen automation tools"
  discription: "Leverage AI to scale your workflow instantly."
  p_cta: "Get Started"
  s_cta: "Learn More"
  image: "/images/hero1.jpg"
  alt: "Hero section image"
logo_cloud:
  title: "Trusted by world-class companies"
  logos:
    - "/logos/google.svg"
    - "/logos/aws.svg"
    - "/logos/microsoft.svg"
Hero_2:
  mh_line: "Fast, Reliable, and Secure"
  tg_line: "Our infrastructure is built for scale."
  discription: "Deploy your projects globally in seconds."
  p_cta: "See Pricing"
  s_cta: "Contact Sales"
  image: "/images/hero2.jpg"
  alt: "Hero 2 image"
---
```

You can then parse this frontmatter into usable props using `gray-matter`.

---

## ⚙️ 4. Loading Data in `page.tsx`

If you’re not using a CMS and just reading `.mdx` or `.json` locally:

```tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Hero_1 from "@/component/hero_1";
import { IndexProps } from "@/types/define_props";

export default async function HomePage() {
  const filePath = path.join(process.cwd(), "content", "homepage.mdx");
  const file = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(file);
  const HomeData = data as IndexProps["HomePage"];

  return (
    <main>
      <Hero_1 Hero_1={HomeData.Hero_1} />
      {/* other components */}
    </main>
  );
}
```

---

## ✅ Summary

| Task         | File                    | Description                    |
| ------------ | ----------------------- | ------------------------------ |
| Define Props | `types/define_props.ts` | ✅ Already done                 |
| Component    | `component/hero_1.tsx`  | Uses `Hero_1Props`             |
| Page         | `app/page.tsx`          | Imports and renders components |
| Data         | `content/homepage.mdx`  | Source content (static or MDX) |

---

If you’d like, I can help you generate:

* The **remaining Hero components (Hero_2 → Hero_4)**
* A **sample `homepage.mdx`**
* Or the **full page.tsx** setup that renders everything

👉 Which one should I write out next?
