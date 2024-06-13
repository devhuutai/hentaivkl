const { resolve } = require("path");
const db = require("./../../utils/database");
const { v4: uuidv4 } = require("uuid");

const { formatTime } = require("./../../utils/time");
exports.indexCategoriesList = async (req, res, next) => {
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
    const [data] = await connection.query(`SELECT uuid, id, name, slug, content, creatAT FROM noah_cateogires WHERE isDeleted IS NULL ${sqlExtra} ORDER BY id DESC LIMIT ? OFFSET ?`, [
      ...values,
      limitPerPage,
      offSet,
    ]);
    const [[count]] = await connection.query(`SELECT COUNT(*) as total FROM noah_cateogires WHERE isDeleted IS NULL ${sqlExtra}`, [...values]);
    const totalPage = Math.ceil(count.total / limitPerPage);

    const dataFormat = [];
    if (!data) {
      connection.release();
      return res.status(403).json({ msg: "Lỗi lấy dữ liệu categoreis list" });
    }
    for (let i = 0; i < data?.length; i++) {
      dataFormat.push({
        id: data[i]?.id,
        uuid: data[i]?.uuid,
        name: data[i]?.name,
        slug: data[i]?.slug,
        content: data[i]?.content,
        creatAT: await formatTime(data[i]?.creatAT),
      });
    }
    connection.release();
    return res.render(`${resolve("./views/erp/categories/categoriesIndex")}`, {
      dataFormat: dataFormat,
      total: count.total || 1,
      totalPage: totalPage || 1,
      page: page || 1,
      limitPerPage: limitPerPage,
      filterName: filterName,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 400, msg: "Lỗi categories index" });
  }
};
exports.create = async (req, res, next) => {
  try {
    const { name, slug, content, title } = req.body;

    const uuid = uuidv4();
    if (!name && !slug && !content) {
      return res.status(401).json({ msg: "lỗi gì đó" });
    }
    const createAT = {
      id: 1,
      time: Date.now(),
    };
    const connection = await db.getConnection();
    const [data] = await connection.query(`SELECT slug FROM noah_cateogires WHERE slug = ?`, [slug]);
    if (data?.length > 0) {
      connection.release();
      return res.status(302).json({ status: 302, msg: `${name} đã tồn tại` });
    }
    const [create] = await connection.query(`INSERT INTO noah_cateogires(uuid, slug, name, content, creatAT, title) VALUES (?, ?, ?, ?, ?,  ?)`, [
      uuid,
      slug,
      name,
      content,
      JSON.stringify(createAT),
      title,
    ]);
    connection.release();
    res.status(200).json({ msg: "created ok" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 400, msg: "Lỗi tạo categories " });
  }
};

exports.creatEdit = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    if (uuid) {
      const connection = await db.getConnection();
      const [[data]] = await connection.query(`SELECT  uuid, name, slug, title, content FROM noah_cateogires WHERE isDeleted IS NULL AND uuid= ? `, [uuid]);
      if (!data) {
        return res.status(404).json({ status: 404, msg: "Something wen't wrong" });
      }
      const dataFormat = {
        uuid: data.uuid,
        name: data.name,
        title: data.title,
        slug: data.slug,
        content: data.content,
      };
      connection.release();
      return res.render(`${resolve("./views/erp/categories/editCategories")}`, { dataFormat: dataFormat });
    }

    return res.render(`${resolve("./views/erp/categories/createCateogires")}`);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 400, msg: "Lỗi tạo categories " });
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { uuid, name, content, slug, title } = req.body;

    if (!uuid) {
      return res.status(203).json({ msg: "Something wen't wrong" });
    }
    const connection = await db.getConnection();
    const [[data]] = await connection.query(`SELECT uuid, name, content, slug, creatAT FROM noah_cateogires WHERE uuid = ?`, [uuid]);
    if (!data) {
      connection.release();
      return res.status(400).json({ status: 400, msg: "Something wen't wrong" });
    }

    await connection.query(`UPDATE noah_cateogires SET name = ?, content = ?, slug = ?, title = ? WHERE uuid = ?`, [name, content, slug, title, data.uuid]);
    connection.release();
    return res.status(200).json({ status: 200, msg: "Chỉnh sữa thể loại thành công" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 400, msg: "Lỗi tạo categories " });
  }
};
exports.deleted = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const isDeleted = {
      id: 1,
      time: Date.now(),
    };
    const connection = await db.getConnection();
    const [[checkData]] = await connection.query(`SELECT slug FROM noah_cateogires WHERE uuid = ?`, [uuid]);
    if (!checkData) {
      connection.release();
      return res.status(404).json({ status: 401, msg: "Thể loại không tồn tại" });
    }
    await connection.query(`UPDATE noah_cateogires SET isDeleted = ?  WHERE uuid = ? `, [JSON.stringify(isDeleted), uuid]);
    connection.release();
    return res.status(201).json({ status: 201, msg: `Xóa thẻ loại thành công` });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 400, msg: "Lỗi tạo categories " });
  }
};
