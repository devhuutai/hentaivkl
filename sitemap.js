const cheerio = require("cheerio");
const db = require("./utils/database");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const fs = require("fs");
async function main() {
  try {
    const connection = await db.getConnection();
    const [data] = await connection.query(`SELECT id, name, slug, creatAT, thumb FROM noah_products WHERE isDeleted IS NULL ORDER BY id DESC`);
    const currentDate = new Date().toISOString();
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetHeader = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlElements = data.map((item) => {
      const url = `
      <url>
        <loc>https://hentaivkl.net/${item.slug}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
      return url;
    });
    const urlsetFooter = "</urlset>";
    const sitemap = `${xmlHeader}${urlsetHeader}${urlElements.join("")}${urlsetFooter}`;
    await fs.writeFileSync("./public/sitemap.xml", sitemap, "utf-8");
    connection.release();
    console.log(`Sitemap đã được tạo mới vào lúc: ${moment(Date.now()).format("DD-MM-YYYY")}`);
  } catch (err) {
    console.log(err);
    return null;
  }
}

function runSitemapGeneration() {
  main();
  setInterval(
    () => {
      main();
    },
    12 * 60 * 60 * 1000
  );
}

// Bắt đầu chạy sitemap generation
runSitemapGeneration();
