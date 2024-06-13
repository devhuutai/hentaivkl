const cheerio = require("cheerio");
const db = require("./utils/database");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const Redis = require("ioredis");

const baseUrl = "https://hentaivll.com";
const redis = new Redis();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getInfo() {
  try {
    let connection = await db.getConnection();
    const [data] = await connection.query(`SELECT id, name, slug FROM noah_products WHERE isDeleted IS NULL`);
    const [cate] = await connection.query(`SELECT id, name FROM noah_cateogires WHERE isDeleted IS NULL`);
    const idcategories = [];

    for (let i = 0; i < data?.length; i++) {
      const productId = data[i]?.id;
      const pageCalled = await redis.get(`pageCalled:${productId}`);

      if (!pageCalled) {
        try {
          const response = await axios.get(`${baseUrl}/${data[i]?.slug}`);
          const $ = cheerio.load(response.data);
          const content = $("p.summary").text();

          $("a.cate-itm[href^='/the-loai/']").each((index, element) => {
            const categoryHref = $(element).text();
            const cateGoriesId = cate?.filter((x) => x.name == categoryHref)?.map((x) => x.id);
            if (cateGoriesId.length > 0) {
              idcategories.push(...cateGoriesId);
            }
          });

          await connection.query(`UPDATE noah_products SET content = ?, idCategories = ? WHERE id = ?`, [content, JSON.stringify(idcategories), productId]);
          await redis.set(`pageCalled:${productId}`, "true");
          console.log(data[i]?.slug);
          await sleep(2000);
        } catch (axiosError) {
          const isDeleted = {
            id: 1,
            time: Date.now(),
          };
          await connection.query(`UPDATE noah_products SET isDeleted = ? WHERE id = ?`, [JSON.stringify(isDeleted), productId]);
          console.error(`Lỗi khi tải trang ${data[i]?.slug}:`, axiosError.message);
        }
      }
    }

    connection.release();
    redis.quit();
  } catch (err) {
    console.log(err);
  }
}

getInfo();
