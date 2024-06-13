const db = require("./../../utils/database");
const { formatTime } = require("./../../utils/time");
const { resolve } = require("path");
exports.index = async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL  ORDER BY id DESC LIMIT 5 `);
    const [products] = await connection.query(`SELECT id, name, slug, creatAT FROM noah_products WHERE isDeleted IS NULL  ORDER BY id DESC LIMIT 5`);
    const [chapters] = await connection.query(`SELECT id, name, chaptersImages, idProducts, slug, creatAT FROM noah_chapters WHERE isDeleted IS NULL  ORDER BY id DESC LIMIT 5`);
    const [[countProducts]] = await connection.query(`SELECT COUNT(*) AS total FROM noah_products WHERE isDeleted IS NULL `);
    const [[countChapters]] = await connection.query(`SELECT COUNT(*) AS total FROM noah_chapters WHERE isDeleted IS NULL `);
    const [[countCategories]] = await connection.query(`SELECT COUNT(*) AS total FROM noah_cateogires WHERE isDeleted IS NULL `);
    const categoriesFormat = [];
    const productsFormat = [];
    const chaptersFormat = [];
    for (let k = 0; k < chapters?.length; k++) {
      chaptersFormat.push({
        id: chapters[k].id,
        slug: chapters[k].slug,
        creatAT: await formatTime(chapters[k].creatAT),
        name: chapters[k].name,
      });
    }
    for (let j = 0; j < products?.length; j++) {
      const countChapters = chapters?.filter((x) => x.idProducts == products[j].id).map((x) => x.chaptersImages)?.length;
      productsFormat.push({
        id: products[j].id,
        name: products[j].name,
        slug: products[j].slug,
        creatAT: await formatTime(products[j].creatAT),
        countChapters: countChapters,
      });
    }
    for (let i = 0; i < dataCategories?.length; i++) {
      categoriesFormat.push({
        id: dataCategories[i]?.id,
        name: dataCategories[i]?.name,
        slug: dataCategories[i]?.slug,
      });
    }
    connection.release();
    return res.render(`${resolve("./views/erp/index")}`, {
      categoriesFormat: categoriesFormat,
      productsFormat: productsFormat,
      chaptersFormat: chaptersFormat,
      totalProducts: countProducts.total,
      totalChapters: countChapters.total,
      totalCategories: countCategories.total,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Lỗi danh sách index admin" });
  }
};
