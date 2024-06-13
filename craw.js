const axios = require("axios");
const cheerio = require("cheerio");
const { resolve } = require("path");
const path = require("path");
const db = require("./utils/database");
const { v4: uuidv4 } = require("uuid");
const baseUrl = "https://hentaivll.com";
const fs = require("fs");
const totalPages = 108;
const outputFolder = "./public/thumb"; // Thay đổi thành đường dẫn thư mục bạn muốn lưu hình ảnh vào.

async function fetchDataFromPage(pageNumber) {
  try {
    let connection = await db.getConnection();
    const response = await axios.get(`${baseUrl}/truyen-tranh-18?page=${pageNumber}`);
    const $ = cheerio.load(response.data);

    // Lấy thông tin từ các phần tử HTML trên trang hiện tại
    $(".visual .manga-thumb").each(async (index, element) => {
      const creatAT = {
        id: 1,
        time: Date.now(),
      };
      const uuid = uuidv4();
      const mangaThumb = $(element);
      const href = mangaThumb.find("a").attr("href");
      const title = mangaThumb.find("a img").attr("alt");
      const imgSrc = mangaThumb.find("img.lazy").attr("data-original");
      const imageName = imgSrc.replace(/^.*[\\/]/, "");
      const finalHref = href.replace("/", "")?.replace("/", "");
      // downloadImages
      const imageResponse = await axios.get(imgSrc, { responseType: "stream" });
      const imagePath = path.join(outputFolder, `${imageName}`);

      const imageStream = fs.createWriteStream(imagePath);
      imageResponse.data.pipe(imageStream);
      await new Promise((resolve, reject) => {
        imageStream.on("finish", resolve);
        imageStream.on("error", reject);
      });
      const [data] = await connection.query(`INSERT INTO noah_products(uuid, name, slug, thumb, creatAT) VALUES (?, ? , ? ,? ,? )`, [uuid, title, finalHref, imageName, JSON.stringify(creatAT)]);
      connection.release();
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchPagesSequentially(totalPages) {
  for (let page = 1; page <= totalPages; page++) {
    console.log(page);
    await fetchDataFromPage(page);
    await new Promise((resolve) => setTimeout(resolve, 1 * 60 * 1000)); // 5 minutes in milliseconds
  }
}

// Call the function to fetch pages sequentially
fetchPagesSequentially(totalPages);
