const { resolve } = require("path");
const db = require("./../../utils/database");
const { v4: uuidv4 } = require("uuid");
const { formatTime } = require("./../../utils/time");
const { changeString } = require("./../../utils/index");

exports.getIndex = async (req, res, next) => {
  try {
    let { page = 1, limitPerPage = 10, filterName } = req.query;
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
    const [data] = await connection.query(
      `SELECT id, uuid, name, slug, content, isTop, tags, status, idCategories, idChillPost, thumb, creatAT, histories FROM noah_products WHERE isDeleted IS NULL ${sqlExtra} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limitPerPage, offSet]
    );
    const [chapters] = await connection.query(`SELECT idProducts, chaptersImages FROM noah_chapters WHERE isDeleted IS NULL`);
    const dataFormat = [];
    for (let i = 0; i < data?.length; i++) {
      const countChapters = chapters?.filter((x) => x.idProducts == data[i]?.id)?.length;
      dataFormat.push({
        id: data[i]?.id,
        uuid: data[i]?.uuid,
        name: data[i]?.name,
        slug: data[i]?.slug,
        content: data[i]?.content,
        isTop: data[i]?.isTop,
        tags: JSON.parse(data[i]?.tags),
        status: data[i]?.status,
        idCategories: data[i]?.idCategories?.length || "Chưa có",
        idChillPost: countChapters,
        thumb: data[i]?.thumb ? `http://localhost:4000/thumb/${data[i]?.thumb}` : `""`,
        creatAT: await formatTime(data[i]?.creatAT),
        histories: data[i]?.histories ? await formatTime(data[i]?.histories?.[0]) : "Chưa cập nhật",
      });
    }
    const [[count]] = await connection.query(`SELECT COUNT(id) as total FROM noah_products WHERE isDeleted IS NULL ${sqlExtra}`, [...values]);
    const totalPage = Math.ceil(count.total / limitPerPage);
    connection.release();
    return res.render(`${resolve("./views/erp/products/productsIndex")}`, {
      dataFormat: dataFormat,
      total: count.total || 1,
      totalPage: totalPage || 1,
      page: page || 1,
      limitPerPage: limitPerPage,
      filterName: filterName,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Something wen't wrong" });
  }
};

exports.creatEdit = async (req, res, next) => {
  try {
    let { page = 1, limitPerPage = 10, filterName } = req.query;
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
    const { slug } = req.params;
    const connection = await db.getConnection();
    const [dataCategories] = await connection.query(`SELECT id, name FROM noah_cateogires WHERE isDeleted IS NULL`);
    const categoriesFormat = [];
    for (let i = 0; i < dataCategories?.length; i++) {
      categoriesFormat.push({
        id: dataCategories[i]?.id,
        name: dataCategories[i]?.name,
      });
    }

    if (!slug) {
      connection.release();
      return res.render(`${resolve("./views/erp/products/productsCreate")}`, { categoriesFormat: categoriesFormat });
    }

    const [[data]] = await connection.query(`SELECT id, name, slug, content, tags, thumb, status, idCategories FROM noah_products WHERE isDeleted IS NULL AND slug = ? `, [slug]);
    const [chapters] = await connection.query(`SELECT uuid, id, name, slug, creatAT FROM noah_chapters WHERE isDeleted IS NULL AND idProducts = ?  ${sqlExtra} ORDER BY name DESC LIMIT ? OFFSET ?`, [
      data.id,
      ...values,
      limitPerPage,
      offSet,
    ]);
    const [count] = await connection.query(`SELECT uuid, id, name, slug, creatAT FROM noah_chapters WHERE isDeleted IS NULL AND idProducts = ? `, [data.id]);
    const totalLength = count.length;

    const totalPage = Math.ceil(totalLength / limitPerPage);
    const chaptersFormat = [];
    for (let i = 0; i < chapters?.length; i++) {
      chaptersFormat.push({
        id: chapters[i].id,
        uuid: chapters[i].uuid,
        name: chapters[i].name,
        slug: chapters[i].slug,
        creatAT: await formatTime(chapters[i].creatAT.time),
      });
    }
    const dataFormat = {
      id: data?.id,
      name: data?.name,
      slug: data?.slug,
      content: data?.content,
      tags: JSON.parse(data?.tags)
        ?.map((x) => x.title)
        ?.join(","),
      status: data?.status,
      thumb: data?.thumb ? `${req.protocol}://${req.headers.host}/thumb/${data?.thumb}` : `""`,
      idCategories: categoriesFormat?.filter((x) => data.idCategories.includes(x.id)),
      chapters: chaptersFormat,
      countChapters: totalLength,
    };
    connection.release();
    return res.render(`${resolve("./views/erp/products/productsEdit")}`, {
      categoriesFormat: categoriesFormat,
      dataFormat: dataFormat,
      total: totalLength || 1,
      totalPage: totalPage || 1,
      page: page || 1,
      limitPerPage: limitPerPage || 1,
      filterName: filterName,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Something wen't wrong" });
  }
};
exports.hotProducts = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(404).json({ msg: "Something wen't wrong" });
    }
    const connection = await db.getConnection();
    const [[data]] = await connection.query(`SELECT id, name, isTop, slug FROM noah_products WHERE slug = ?`, [slug]);
    if (!data) {
      return res.status(404).json({ msg: "Something wen't wrong" });
    }
    const [updateIsTop] = await connection.query(`UPDATE noah_products SET isTop = ${data.isTop == 1 ? 0 : `1`} WHERE slug = ? `, [data?.slug]);
    connection.release();
    return res.redirect("/erp/products");
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Something wen't wrong" });
  }
};
