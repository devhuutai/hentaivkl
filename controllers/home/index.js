const db = require("./../../utils/database");
const { resolve } = require("path");
const { formatTime } = require("./../../utils/time");
const moment = require("moment");
const { cacheMiddleware, saveCache, cacheUpdateCountViewDetail } = require("./../../utils/redis"); // Thay đổi đường dẫn tới file middleware của bạn

exports.home = async (req, res, next) => {
  try {
    const dataCache = await cacheMiddleware(req, res, next);
    if (dataCache) {
      return res.render(`${resolve("./views/home/index")}`, {
        newUpdateFormat: dataCache.newUpdateFormat,
        urlSeo: dataCache.urlSeo,
        newProductsFormat: dataCache.newProductsFormat,
        categoriesFormat: dataCache.categoriesFormat,
        productsHOT: dataCache.productsHOT,
        dataConfigsFooter: dataCache.dataConfigsFooter,
        dataConfigsFooterTags: dataCache.dataConfigsFooterTags,
        dataConfigsFooterEmail: dataCache.dataConfigsFooterEmail,
        dataConfigsFooterCopy: dataCache.dataConfigsFooterCopy,
        dataConfigsFooterTitle: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterKeywords: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterDescription: dataCache.dataConfigsFooterTitle,
        viewCount: dataCache.viewCount || 0,
      });
    } else {
      const connection = await db.getConnection();
      const [dataNewUpdate] = await connection.query(`SELECT id, name, slug, thumb, histories
FROM noah_products
WHERE isDeleted IS NULL
ORDER BY CAST(JSON_EXTRACT(histories, '$[0].time') AS UNSIGNED) DESC
LIMIT 30;`);
      const [dataNewProducts] = await connection.query(`SELECT id, name, slug, histories, creatAT, thumb FROM noah_products WHERE isDeleted IS NULL ORDER BY id DESC LIMIT 12`);
      const [dataProductsHOT] = await connection.query(`SELECT id, name, slug,  thumb FROM noah_products WHERE isTop = 1 AND isDeleted IS NULL LIMIT 6 `);
      const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL ORDER BY ID DESC`);
      const [dataChapters] = await connection.query(`SELECT id, name, slug, idProducts FROM noah_chapters WHERE isDeleted IS NULL ORDER BY id ASC`);
      const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
      const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
      const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
      const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
      const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
      const urlSeo = `https://hentaivkl.net`;

      const categoriesFormat = [];
      const newUpdateFormat = [];
      const newProductsFormat = [];
      const productsHOT = [];
      for (let c = 0; c < dataProductsHOT?.length; c++) {
        productsHOT.push({
          id: dataProductsHOT[c]?.id,
          name: dataProductsHOT[c]?.name,
          slug: dataProductsHOT[c]?.slug,
          thumb: dataProductsHOT[c]?.thumb ? `https://media.hentaimoi.pro/thumb/${dataProductsHOT[c]?.thumb}` : `""`,
        });
      }
      for (let k = 0; k < dataCategories?.length; k++) {
        categoriesFormat.push({
          id: dataCategories[k]?.id,
          name: dataCategories[k]?.name,
          slug: dataCategories[k]?.slug,
        });
      }

      for (let j = 0; j < dataNewProducts?.length; j++) {
        const chapters = dataChapters?.filter((x) => x.idProducts == dataNewProducts[j].id)?.map((x) => x)[0];
        newProductsFormat.push({
          id: dataNewProducts[j].id,
          name: dataNewProducts[j].name,
          slug: dataNewProducts[j].slug,
          thumb: dataNewProducts[j]?.thumb ? `https://media.hentaimoi.pro/thumb/${dataNewProducts[j]?.thumb}` : `""`,
          chapterName: chapters?.name || "Chưa có",
          chapterSlug: chapters?.slug || "",
          chapterId: chapters?.id || "",
          creatAT: dataNewProducts[j]?.creatAT ? await formatTime(dataNewProducts[j]?.creatAT) : "Chưa cập nhật",
        });
      }
      for (let i = 0; i < dataNewUpdate?.length; i++) {
        const chapters = dataChapters?.filter((x) => x.idProducts == dataNewUpdate[i].id)?.map((x) => x)[0];
        newUpdateFormat.push({
          id: dataNewUpdate[i].id,
          name: dataNewUpdate[i].name,
          slug: dataNewUpdate[i].slug,
          thumb: dataNewUpdate[i]?.thumb ? `https://media.hentaimoi.pro/thumb/${dataNewUpdate[i]?.thumb}` : `""`,
          histories: dataNewUpdate[i]?.histories ? await formatTime(dataNewUpdate[i]?.histories?.[0]) : "Chưa cập nhật",
          chapterName: chapters?.name || "Chưa có",
          chapterSlug: chapters?.slug || "",
          chapterId: chapters?.id || "",
        });
      }
      connection.release();
      // const dataCache = {
      //   newUpdateFormat: newUpdateFormat,
      //   urlSeo: urlSeo,
      //   newProductsFormat: newProductsFormat,
      //   categoriesFormat: categoriesFormat,
      //   productsHOT: productsHOT,
      //   dataConfigsFooter: dataConfigsFooter.data.data,
      //   dataConfigsFooterTags: dataConfigsFooterTags.data,
      //   dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
      //   dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
      //   dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
      //   dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
      //   dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
      // };
      // const cacheData = await saveCache(dataCache, 360000);
      // cacheData(req, res, async () => {
      //   console.log("Data cached: ", `${req.protocol}://${req.get("host")}${req.originalUrl}`);
      // });
      return res.render(`${resolve("./views/home/index")}`, {
        newUpdateFormat: newUpdateFormat,
        urlSeo: urlSeo,
        newProductsFormat: newProductsFormat,
        categoriesFormat: categoriesFormat,
        productsHOT: productsHOT,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
  }
};
exports.detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const dataCache = await cacheMiddleware(req, res, next);
    if (dataCache) {
      const connection = await db.getConnection();
      const [[data]] = await connection.query(`SELECT id, name, slug, content, tags, status, idCategories, thumb, views FROM noah_products WHERE slug = ? AND isDeleted IS NULL`, [slug]);
      const views = data.views || [];
      views.push({
        time: Date.now(),
        view: 1,
      });
      const [update] = await connection.query(`UPDATE noah_products SET views = ? `, [JSON.stringify(views)]);
      connection.release();
      return res.render(`${resolve("./views/home/detail")}`, {
        dataFormat: dataCache.dataFormat,
        urlSeo: dataCache.urlSeo,
        categoriesFormat: dataCache.categoriesFormat,
        dataConfigsFooter: dataCache.dataConfigsFooter,
        dataConfigsFooterTags: dataCache.dataConfigsFooterTags,
        dataConfigsFooterEmail: dataCache.dataConfigsFooterEmail,
        dataConfigsFooterCopy: dataCache.dataConfigsFooterCopy,
        dataConfigsFooterTitle: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterKeywords: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterDescription: dataCache.dataConfigsFooterTitle,
        newProductsFormat: dataCache.newProductsFormat,
        randomProductsFormat: dataCache.randomProductsFormat,
        views: dataCache.views,
      });
    } else {
      const connection = await db.getConnection();
      const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
      const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
      const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
      const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
      const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
      const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL ORDER BY ID DESC`);
      const categoriesFormat = [];

      for (let k = 0; k < dataCategories?.length; k++) {
        categoriesFormat.push({
          id: dataCategories[k]?.id,
          name: dataCategories[k]?.name,
          slug: dataCategories[k]?.slug,
        });
      }

      const [[data]] = await connection.query(`SELECT id, name, slug, content, tags, status, idCategories, thumb, views FROM noah_products WHERE slug = ? AND isDeleted IS NULL`, [slug]);
      const [categories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires where isDeleted IS NULL`);
      const [dataChapters] = await connection.query(`SELECT id, name, slug, idProducts, creatAT FROM noah_chapters WHERE isDeleted IS NULL AND idProducts = ?`, [data?.id]);
      const [chaptersDetailOfRandom] = await connection.query(`SELECT id, name, slug, idProducts, creatAT FROM noah_chapters WHERE isDeleted IS NULL`);
      const [dataNewProducts] = await connection.query(`SELECT id, name, slug, histories, creatAT, thumb FROM noah_products WHERE isDeleted IS NULL ORDER BY id DESC LIMIT 5`);
      const [randomProducts] = await connection.query(`SELECT id, name, slug, histories, creatAT, thumb FROM noah_products WHERE isDeleted IS NULL ORDER BY RAND() ASC LIMIT 5`);
      const firtsChapters = dataChapters?.filter((x) => x.idProducts == data.id)?.map((x) => x)[0];
      const urlSeo = `https://hentaivkl.net`;
      const dataChaptersFormat = [];
      const newProductsFormat = [];
      const randomProductsFormat = [];
      //check !data
      if (!data) {
        connection.release();
        return res.redirect("/");
      }
      const views = data.views || [];

      for (let i = 0; i < dataChapters?.length; i++) {
        dataChaptersFormat.push({
          id: dataChapters[i]?.id,
          name: dataChapters[i]?.name,
          slug: dataChapters[i]?.slug,
          creatAT: dataChapters[i]?.creatAT ? moment(dataChapters[i]?.creatAT).format("DD/MM/YYYY") : "Chưa có",
        });
      }

      for (let j = 0; j < dataNewProducts?.length; j++) {
        const chapters = chaptersDetailOfRandom?.filter((x) => x.idProducts == dataNewProducts[j].id)?.[0];
        newProductsFormat.push({
          id: dataNewProducts[j].id,
          name: dataNewProducts[j].name,
          slug: dataNewProducts[j].slug,
          thumb: dataNewProducts[j]?.thumb ? `https://media.hentaimoi.pro/thumb/${dataNewProducts[j]?.thumb}` : `""`,
          chapterName: chapters?.name || "Chưa có",
          chapterSlug: chapters?.slug || "",
          chapterId: chapters?.id || "",
          creatAT: dataNewProducts[j]?.creatAT ? await formatTime(dataNewProducts[j]?.creatAT) : "Chưa cập nhật",
        });
      }

      for (let k = 0; k < randomProducts?.length; k++) {
        const chapters = chaptersDetailOfRandom?.filter((x) => x.idProducts == randomProducts[k].id)?.[0];
        randomProductsFormat.push({
          id: randomProducts[k].id,
          name: randomProducts[k].name,
          slug: randomProducts[k].slug,
          thumb: randomProducts[k]?.thumb ? `https://media.hentaimoi.pro/thumb/${randomProducts[k]?.thumb}` : `""`,
          chapterName: chapters?.name || "Chưa có",
          chapterSlug: chapters?.slug || "",
          chapterId: chapters?.id || "",
          creatAT: randomProducts[k]?.creatAT ? await formatTime(randomProducts[k]?.creatAT) : "Chưa cập nhật",
        });
      }
      const dataFormat = {
        id: data?.id,
        name: data?.name,
        slug: data?.slug,
        content: data?.content,
        tags: data?.tags ? JSON?.parse(data?.tags) : [],
        status: data?.status,
        categories: categories?.filter((x) => data?.idCategories?.includes(x?.id)),
        thumb: data?.thumb ? `https://media.hentaimoi.pro/thumb/${data?.thumb}` : `""`,
        dataChaptersFormat: dataChaptersFormat,
        firtsChapters: firtsChapters,
      };
      connection.release();
      const dataCache = {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        newProductsFormat: newProductsFormat,
        randomProductsFormat: randomProductsFormat,
        timeCache: 360000,
        views: views?.map((x) => x.view)?.reduce((a, b) => a + b, 0) || 1,
      };
      const cacheData = await saveCache(dataCache, 360000);
      cacheData(req, res, async () => {
        console.log("Data cached: ", `${req.protocol}://${req.get("host")}${req.originalUrl}`);
      });
      return res.render(`${resolve("./views/home/detail")}`, {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        newProductsFormat: newProductsFormat,
        randomProductsFormat: randomProductsFormat,
        views: views?.map((x) => x.view)?.reduce((a, b) => a + b, 0) || 1,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
  }
};
exports.categories = async (req, res, next) => {
  try {
    let { page = 1, limitPerPage = 30, filterName } = req.query;
    const dataCache = await cacheMiddleware(req, res, next);
    if (dataCache) {
      return res.render(`${resolve("./views/home/categories")}`, {
        dataFormat: dataCache.dataFormat,
        urlSeo: dataCache.urlSeo,
        categoriesIndex: dataCache.categoriesIndex,
        categoriesFormat: dataCache.categoriesFormat,
        dataConfigsFooter: dataCache.dataConfigsFooter,
        dataConfigsFooterTags: dataCache.dataConfigsFooterTags,
        dataConfigsFooterEmail: dataCache.dataConfigsFooterEmail,
        dataConfigsFooterCopy: dataCache.dataConfigsFooterCopy,
        dataConfigsFooterTitle: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterKeywords: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterDescription: dataCache.dataConfigsFooterTitle,
        total: dataCache.total || 1,
        totalPage: dataCache.totalPage || 1,
        page: dataCache.page || 1,
        limitPerPage: dataCache.limitPerPage,
        filterName: dataCache.filterName,
      });
    } else {
      const { slug } = req.params;
      let sqlExtra = "";
      const values = [];
      if (filterName) {
        sqlExtra += " AND ( name LIKE ? OR slug = ?)";
        values.push(`%${filterName}%`, `%${filterName}%`);
      }
      const offSet = (parseInt(page) - 1) * limitPerPage;
      if (isNaN(page) || isNaN(limitPerPage) || page < 1 || limitPerPage < 1) {
        return res.status(400).json({ message: "Invalid query parameters" });
      }
      const connection = await db.getConnection();
      const [[data]] = await connection.query(`SELECT id, name, slug, content, title FROM noah_cateogires WHERE isDeleted IS NULL  AND slug = ?  `, [slug]);
      const categoryIds = data?.id;
      const [productData] = await connection.query(
        `SELECT id, name, slug, thumb, histories FROM noah_products WHERE isDeleted IS NULL AND JSON_CONTAINS(idCategories, ?) ${sqlExtra} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [JSON.stringify(categoryIds), ...values, limitPerPage, offSet]
      );
      const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
      const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
      const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
      const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
      const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
      const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL ORDER BY ID DESC`);
      const categoriesFormat = [];
      const urlSeo = `https://hentaivkl.net/`;

      for (let k = 0; k < dataCategories?.length; k++) {
        categoriesFormat.push({
          id: dataCategories[k]?.id,
          name: dataCategories[k]?.name,
          slug: dataCategories[k]?.slug,
        });
      }
      const [[total]] = await connection.query(`SELECT COUNT(*) as total FROM noah_products WHERE isDeleted IS NULL AND JSON_CONTAINS(idCategories, ?)`, [JSON.stringify(categoryIds)]);
      const [dataChapters] = await connection.query(`SELECT id, name, idProducts, creatAT, slug FROM noah_chapters WHERE isDeleted IS NULL ORDER BY id DESC `);
      const count = total.total || 0;
      const totalPage = Math.ceil(count / limitPerPage);
      const dataFormat = [];
      for (let i = 0; i < productData?.length; i++) {
        const chapters = dataChapters?.filter((x) => x.idProducts == productData[i]?.id)?.map((x) => x)[0] || "";
        dataFormat.push({
          id: productData[i]?.id,
          name: productData[i]?.name,
          slug: productData[i]?.slug,
          thumb: productData[i]?.thumb ? `https://media.hentaimoi.pro/thumb/${productData[i]?.thumb}` : `""`,
          histories: productData[i]?.histories || "",
          idChapters: chapters?.id,
          nameChapters: chapters?.name || "Chưa có",
          slugChapters: chapters?.slug,
          timeChapters: chapters?.creatAT ? await formatTime(chapters?.creatAT) : "Chưa có",
        });
      }
      const categoriesIndex = {
        id: data?.id,
        name: data?.name,
        title: data?.title,
        slug: data?.slug,
        content: data?.content || "",
      };
      connection.release();
      const dataCache = {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesIndex: categoriesIndex,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        total: count || 1,
        totalPage: totalPage || 1,
        page: page || 1,
        limitPerPage: limitPerPage,
        filterName: filterName,
      };
      const cacheData = await saveCache(dataCache, 360000);
      cacheData(req, res, async () => {
        console.log("Data cached: ", `${req.protocol}://${req.get("host")}${req.originalUrl}`);
      });
      return res.render(`${resolve("./views/home/categories")}`, {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesIndex: categoriesIndex,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        total: count || 1,
        totalPage: totalPage || 1,
        page: page || 1,
        limitPerPage: limitPerPage,
        filterName: filterName,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
  }
};
exports.chapters = async (req, res, next) => {
  try {
    let { slug, chapter, id } = req.params;
    if (!req.session) {
      req.session = {};
    }
    const dataCache = await cacheMiddleware(req, res, next);
    if (dataCache) {
      return res.render(`${resolve("./views/home/chapters")}`, {
        dataFormat: dataCache.dataFormat,
        urlSeo: dataCache.urlSeo,
        categoriesFormat: dataCache.categoriesFormat,
        dataConfigsFooter: dataCache.dataConfigsFooter,
        dataConfigsFooterTags: dataCache.dataConfigsFooterTags,
        dataConfigsFooterEmail: dataCache.dataConfigsFooterEmail,
        dataConfigsFooterCopy: dataCache.dataConfigsFooterCopyt,
        dataConfigsFooterTitle: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterKeywords: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterDescription: dataCache.dataConfigsFooterTitle,
        newProductsFormat: dataCache.newProductsFormat,
        listChapters: dataCache.listChapters,
      });
    } else {
      if (!slug || !chapter || !id) {
        return res.redirect("/");
      }
      const connection = await db.getConnection();
      const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
      const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
      const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
      const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
      const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
      const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL ORDER BY ID DESC`);
      const [dataNewProducts] = await connection.query(`SELECT id, name, slug, histories, creatAT, thumb FROM noah_products WHERE isDeleted IS NULL ORDER BY id DESC LIMIT 12`);
      const [dataChaptersProductNew] = await connection.query(`SELECT id, name, idProducts, creatAT, slug FROM noah_chapters WHERE isDeleted IS NULL ORDER BY id DESC `);
      const urlSeo = `https://hentaivkl.net`;

      const categoriesFormat = [];
      const newProductsFormat = [];
      for (let k = 0; k < dataCategories?.length; k++) {
        categoriesFormat.push({
          id: dataCategories[k]?.id,
          name: dataCategories[k]?.name,
          slug: dataCategories[k]?.slug,
        });
      }
      for (let j = 0; j < dataNewProducts?.length; j++) {
        const chapters = dataChaptersProductNew?.filter((x) => x.idProducts == dataNewProducts[j].id)?.map((x) => x)[0];
        newProductsFormat.push({
          id: dataNewProducts[j].id,
          name: dataNewProducts[j].name,
          slug: dataNewProducts[j].slug,
          thumb: dataNewProducts[j]?.thumb ? `https://media.hentaimoi.pro/thumb/${dataNewProducts[j]?.thumb}` : `""`,
          chapterName: chapters?.name || "Chưa có",
          chapterSlug: chapters?.slug || "",
          chapterId: chapters?.id || "",
          creatAT: dataNewProducts[j]?.creatAT ? await formatTime(dataNewProducts[j]?.creatAT) : "Chưa cập nhật",
        });
      }
      const [[products]] = await connection.query(`SELECT id, name, slug, idCategories, thumb FROM noah_products WHERE slug = ? AND isDeleted IS NULL`, [slug]);
      if (!products) {
        connection.release();
        return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
      }
      const idGategories = products?.idCategories?.map((x) => x)?.[0] || 1;
      const [[cateGoriesProducts]] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL AND id = ?`, idGategories);
      const [[dataChapters]] = await connection.query(`SELECT id, name, slug, chaptersImages, creatAT FROM noah_chapters WHERE slug = ? AND id = ? AND idProducts = ?`, [chapter, id, products?.id]);
      const [[prevChapter]] = await connection.query(` SELECT id, name, slug, chaptersImages, creatAT FROM noah_chapters WHERE idProducts = ? AND id < ? ORDER BY id DESC LIMIT 1`, [products?.id, id]);
      const [[nextChapter]] = await connection.query(`SELECT id, name, slug, chaptersImages, creatAT FROM noah_chapters WHERE idProducts = ? AND id > ? ORDER BY id ASC LIMIT 1`, [products?.id, id]);
      if (!dataChapters) {
        connection.release();
        return res.redirect("/");
      }
      const listChapters = dataChaptersProductNew?.filter((x) => x?.idProducts == products?.id)?.map((x) => x);
      const dataFormat = {
        id: dataChapters?.id,
        name: products?.name,
        thumb: products?.thumb ? `https://media.hentaimoi.pro/thumb/${products.thumb}` : `""`,
        slug: products?.slug,
        chapterName: dataChapters?.name,
        chapterSlug: dataChapters?.slug,
        categoriesName: cateGoriesProducts.name || "Chứa có",
        categoriesSlug: cateGoriesProducts.slug || "Chứa có",
        chaptersImages: dataChapters.chaptersImages.map((image) => `https://media.hentaimoi.pro/${image.path?.replace("", "")}/${image.fileName}`),
        creatAT: moment(dataChapters?.creatAT).format("HH:SS DD-MM-YYYY"),
        prevChapter: prevChapter,
        nextChapter: nextChapter,
      };

      connection.release();
      const dataCache = {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        newProductsFormat: newProductsFormat,
        listChapters: listChapters,
      };
      const cacheData = await saveCache(dataCache, 360000);
      cacheData(req, res, async () => {
        console.log("Data cached: ", `${req.protocol}://${req.get("host")}${req.originalUrl}`);
      });
      return res.render(`${resolve("./views/home/chapters")}`, {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        newProductsFormat: newProductsFormat,
        listChapters: listChapters,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
  }
};
exports.tags = async (req, res, next) => {
  try {
    const dataCache = await cacheMiddleware(req, res, next);
    if (dataCache) {
      return res.render(`${resolve("./views/home/tags")}`, {
        dataFormat: dataCache.dataFormat,
        urlSeo: dataCache.urlSeo,
        categoriesFormat: dataCache.categoriesFormat,
        dataConfigsFooter: dataCache.dataConfigsFooter,
        dataConfigsFooterTags: dataCache.dataConfigsFooterTags,
        dataConfigsFooterEmail: dataCache.dataConfigsFooterEmail,
        dataConfigsFooterCopy: dataCache.dataConfigsFooterCopy,
        dataConfigsFooterTitle: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterKeywords: dataCache.dataConfigsFooterTitle,
        dataConfigsFooterDescription: dataCache.dataConfigsFooterTitle,
        total: dataCache.total || 1,
        totalPage: dataCache.totalPage || 1,
        page: dataCache.page || 1,
        limitPerPage: dataCache.limitPerPage,
        filterName: dataCache.filterName,
        slug: dataCache.slug,
        firstTags: dataCache.firstTags,
      });
    } else {
      const { slug } = req.params;
      let { page = 1, limitPerPage = 30, filterName } = req.query;

      let sqlExtra = "";
      const values = [];
      if (filterName) {
        sqlExtra += " AND ( name LIKE ? OR slug = ?)";
        values.push(`%${filterName}%`, `%${filterName}%`);
      }
      const offSet = (parseInt(page) - 1) * limitPerPage;
      if (isNaN(page) || isNaN(limitPerPage) || page < 1 || limitPerPage < 1) {
        return res.status(400).json({ message: "Invalid query parameters" });
      }
      if (!slug) {
        return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
      }
      const connection = await db.getConnection();
      const [data] = await connection.query(
        `SELECT id, name, slug, thumb, tags  FROM noah_products WHERE isDeleted IS NULL  AND JSON_CONTAINS(tags, '{"changeString": "${slug}"}') ${sqlExtra} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...values, limitPerPage, offSet]
      );
      const [[count]] = await connection.query(
        `SELECT COUNT(id) as total FROM noah_products WHERE isDeleted IS NULL  AND JSON_CONTAINS(tags, '{"changeString": "${slug}"}') ${sqlExtra} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...values, limitPerPage, offSet]
      );
      const totalPage = Math.ceil(count.total / limitPerPage);
      const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
      const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
      const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
      const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
      const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
      const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL ORDER BY ID DESC`);
      const categoriesFormat = [];
      const dataFormat = [];
      const [dataChapters] = await connection.query(`SELECT id, name, idProducts, creatAT, slug FROM noah_chapters WHERE isDeleted IS NULL ORDER BY id DESC `);
      const urlSeo = `https://hentaivkl.net`;

      for (let k = 0; k < dataCategories?.length; k++) {
        categoriesFormat.push({
          id: dataCategories[k]?.id,
          name: dataCategories[k]?.name,
          slug: dataCategories[k]?.slug,
        });
      }

      for (let i = 0; i < data?.length; i++) {
        const chapters = dataChapters?.filter((x) => x.idProducts == data[i]?.id)?.map((x) => x)[0] || "";
        dataFormat.push({
          id: data[i]?.id,
          name: data[i]?.name,
          slug: data[i]?.slug,
          thumb: data[i]?.thumb ? `https://media.hentaimoi.pro/thumb/${data[i]?.thumb}` : `""`,
          histories: data[i]?.histories || "",
          idChapters: chapters?.id,
          nameChapters: chapters?.name || "Chưa có",
          slugChapters: chapters?.slug,
          timeChapters: chapters?.creatAT ? await formatTime(chapters?.creatAT) : "Chưa có",
          tags: data[i]?.tags,
        });
      }
      const firstTags = {
        nameTags: dataFormat[0]?.tags ? JSON.parse(dataFormat[0]?.tags)?.map((x) => x.title)[0] : "",
        slugTags: dataFormat[0]?.tags ? JSON.parse(dataFormat[0]?.tags)?.map((x) => x.changeString)[0] : "",
      };
      connection.release();
      const dataCache = {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        total: count || 1,
        totalPage: totalPage || 1,
        page: page || 1,
        limitPerPage: limitPerPage,
        filterName: filterName,
        slug: slug,
        firstTags: firstTags,
      };
      const cacheData = await saveCache(dataCache, 360000);
      cacheData(req, res, async () => {
        console.log("Data cached: ", `${req.protocol}://${req.get("host")}${req.originalUrl}`);
      });
      return res.render(`${resolve("./views/home/tags")}`, {
        dataFormat: dataFormat,
        urlSeo: urlSeo,
        categoriesFormat: categoriesFormat,
        dataConfigsFooter: dataConfigsFooter.data.data,
        dataConfigsFooterTags: dataConfigsFooterTags.data,
        dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
        dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
        dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
        dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
        dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
        total: count || 1,
        totalPage: totalPage || 1,
        page: page || 1,
        limitPerPage: limitPerPage,
        filterName: filterName,
        slug: slug,
        firstTags: firstTags,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
  }
};
exports.histories = async (req, res, next) => {
  try {
    let dataHistories = req.session.history || [];
    const connection = await db.getConnection();
    const [data] = await connection.query(`SELECT id, name, slug, thumb FROM noah_products WHERE isDeleted IS NULL`);
    const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
    const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
    const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
    const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
    const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
    const [dataCategories] = await connection.query(`SELECT id, name, slug FROM noah_cateogires WHERE isDeleted IS NULL ORDER BY ID DESC`);
    const categoriesFormat = [];
    for (let k = 0; k < dataCategories?.length; k++) {
      categoriesFormat.push({
        id: dataCategories[k]?.id,
        name: dataCategories[k]?.name,
        slug: dataCategories[k]?.slug,
      });
    }
    const urlSeo = `https://hentaivkl.net`;
    connection.release();
    return res.render(`${resolve("./views/home/histories")}`, {
      urlSeo: urlSeo,
      categoriesFormat: categoriesFormat,
      dataConfigsFooter: dataConfigsFooter.data.data,
      dataConfigsFooterTags: dataConfigsFooterTags.data,
      dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
      dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
      dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
      dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
      dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
  }
};
