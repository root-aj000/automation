const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filepath = path.join(process.cwd(), "content", "main", "homepage.mdx");
console.log("Reading file from:", filepath);

try {
    const file = fs.readFileSync(filepath, "utf-8");
    const { data } = matter(file);

    console.log(JSON.stringify(data, null, 2));

} catch (error) {
    console.error("Error reading or parsing file:", error);
}
