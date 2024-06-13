const { resolve } = require("path");
const db = require("./../../utils/database");
const { v4: uuidv4 } = require("uuid");
const { formatTime } = require("./../../utils/time");
const path = require("path");
const fs = require("fs");
exports.chapterList = async (req, res, next) => {
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
    const [data] = await connection.query(`SELECT id, uuid, name, slug, creatAT, idProducts FROM noah_chapters WHERE isDeleted IS NULL ${sqlExtra} ORDER BY name DESC LIMIT ? OFFSET ?`, [
      ...values,
      limitPerPage,
      offSet,
    ]);
    const [products] = await connection.query(`SELECT id, name FROM noah_products WHERE isDeleted IS NULL`);
    const [[count]] = await connection.query(`SELECT COUNT(*) as total FROM noah_chapters WHERE isDeleted IS NULL ${sqlExtra}`, [...values]);
    const totalPage = Math.ceil(count.total / limitPerPage);
    const dataFormat = [];
    if (!data) {
      connection.release();
      return res.status(403).json({ msg: "Lỗi lấy dữ liệu products list" });
    }
    for (let i = 0; i < data?.length; i++) {
      const productInfo = products?.find((x) => x.id == data[i]?.idProducts)?.name;
      dataFormat.push({
        id: data[i]?.id,
        uuid: data[i]?.uuid,
        name: data[i]?.name,
        slug: data[i]?.slug,
        productInfo: productInfo || "",
        creatAT: await formatTime(data[i]?.creatAT),
      });
    }
    connection.release();
    return res.render(`${resolve("./views/erp/chapters/chaptersIndex")}`, {
      dataFormat: dataFormat,
      total: count?.total || 1,
      totalPage: totalPage || 1,
      page: page || 1,
      limitPerPage: limitPerPage || 1,
      filterName: filterName,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
exports.createForm = async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [dataProducts] = await connection.query(`SELECT id, name FROM noah_products WHERE isDeleted IS NULL`);
    const productsFormat = [];
    for (let i = 0; i < dataProducts?.length; i++) {
      productsFormat.push({
        id: dataProducts[i].id,
        name: dataProducts[i].name,
      });
    }
    connection.release();
    return res.render(`${resolve("./views/erp/chapters/createChapters")}`, {
      productsFormat: productsFormat,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};

exports.create = async (req, res, next) => {
  try {
    let { name, slug, idProducts } = req.body;
    const uuid = uuidv4();
    const images = req.files;
    if (!images || !name || !slug) {
      return res.status(400).json({ status: 400, msg: "something wen't wrong" });
    }
    const filesInfo = req.files.map((file) => {
      const pathParts = req.uploadPath.split(path.sep);
      const formattedPath = `/${pathParts.slice(-3).join("/")}`;
      return {
        fileName: file.filename,
        path: formattedPath,
        originalPath: file.path,
      };
    });
    const creatAT = {
      id: 1,
      time: Date.now(),
    };

    const connection = await db.getConnection();
    const [data] = await connection.query(`INSERT INTO noah_chapters (uuid, name, slug, chaptersImages, idProducts, creatAT) VALUES (?, ?, ?, ?, ?, ?)`, [
      uuid,
      name,
      slug,
      JSON.stringify(filesInfo),
      Number(idProducts),
      JSON.stringify(creatAT),
    ]);
    connection.release();
    return res.status(200).json({ status: 200, msg: `Chapters ${name} create is ok` });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
exports.update = async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    if (!uuid) {
      return res.status(404).json({ status: 404, msg: "something wen't wrong" });
    }
    const isDeleted = {
      id: 1,
      time: Date.now(),
    };
    const connection = await db.getConnection();
    const [[data]] = await connection.query(`SELECT id, name, uuid, chaptersImages FROM noah_chapters WHERE isDeleted IS NULL AND uuid = ? `, [uuid]);
    if (!data) {
      return res.status(404).json({ status: 404, msg: "something wen't wrong" });
    }
    const isNeedDeleted = data.chaptersImages.map((image) => resolve(`./dataImages${image.path}/${image.fileName}`));
    isNeedDeleted.forEach((file) => {
      const filePath = file;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${file}: ${err.message}`);
        } else {
          console.log(`File ${file} deleted successfully.`);
        }
      });
    });
    const [updateChapters] = await connection.query(`UPDATE noah_chapters SET isDeleted = ? WHERE uuid = ?`, [JSON.stringify(isDeleted), data.uuid]);
    connection.release();
    return res.status(200).json({ status: 200, msg: "Chapters is deleted OK" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};

exports.creatEdit = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    if (!uuid) {
      return res.status(404).json({ status: 404, msg: "something wen't wrong" });
    }
    const connection = await db.getConnection();
    const [[data]] = await connection.query(`SELECT id, uuid, name, slug, chaptersImages, idProducts FROM noah_chapters WHERE isDeleted IS NULL AND uuid = ?`, [uuid]);
    if (!data) {
      return res.status(404).json({ status: 404, msg: "something wen't wrong" });
    }
    const [[productsManaga]] = await connection.query(`SELECT id, name FROM noah_products WHERE isDeleted IS NULL AND id = ? `, [data.idProducts]);
    const dataFormat = {
      id: data.id,
      uuid: data.uuid,
      name: data.name,
      slug: data.slug,
      chaptersImages: data.chaptersImages.map((image) => `${req.protocol}://localhost:4000/dataImages${image.path}/${image.fileName}`),
      idProducts: productsManaga,
    };
    connection.release();
    return res.render(`${resolve("./views/erp/chapters/chaptersEdit")}`, {
      dataFormat: dataFormat,
      productsFormat: [],
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
