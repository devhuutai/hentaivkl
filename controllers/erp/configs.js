const db = require("./../../utils/database");
const { formatTime } = require("./../../utils/time");
const { resolve } = require("path");
const { changeString } = require("./../../utils/index");

exports.home = async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
    const [[dataConfigsFooterTags]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [2]);
    const [[dataConfigsFooterEmail]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [3]);
    const [[dataConfigsFooterCopy]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [4]);
    const [[dataConfigsFooterTitle]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [5]);
    connection.release();
    const tags = dataConfigsFooterTags.data?.map((x) => x.title)?.join(",");

    return res.render(`${resolve("./views/erp/settings/index")}`, {
      dataConfigsFooter: dataConfigsFooter.data.data,
      dataConfigsFooterTags: tags,
      dataConfigsFooterEmail: dataConfigsFooterEmail.data.email,
      dataConfigsFooterCopy: dataConfigsFooterCopy.data.copyright,
      dataConfigsFooterTitle: dataConfigsFooterTitle.data.title,
      dataConfigsFooterKeywords: dataConfigsFooterTitle.data.keywords,
      dataConfigsFooterDescription: dataConfigsFooterTitle.data.description,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
exports.footers = async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [[dataConfigsFooter]] = await connection.query(`SELECT id, name, data FROM noah_configs WHERE id = ?`, [1]);
    connection.release();
    return res.render(`${resolve("./views/erp/settings/footer")}`, {
      dataConfigsFooter: dataConfigsFooter.data.data,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
exports.editHome = async (req, res, next) => {
  try {
    const { title, keywords, description, copy, tags } = req.body;
    const splitTags = tags.split(",").map((tag) => tag.trim());
    const formattedTags = splitTags.map((tag) => {
      return {
        title: tag,
        changeString: changeString(tag),
      };
    });
    const homepageFormat = {
      title: title,
      keywords: keywords,
      description: description,
    };
    const copyFormat = {
      copyright: copy,
    };

    const connection = await db.getConnection();
    const [updateHome] = await connection.query(`UPDATE noah_configs SET data = ? WHERE id = 5`, [JSON.stringify(homepageFormat)]);
    const [updateTags] = await connection.query(`UPDATE noah_configs SET data = ? WHERE id = 2`, [JSON.stringify(formattedTags)]);
    const [updateCopy] = await connection.query(`UPDATE noah_configs SET data = ? WHERE id = 4`, [JSON.stringify(copyFormat)]);
    connection.release();
    return res.status(200).json({ status: 200, msg: "Update home page is ok" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
exports.editFooter = async (req, res, next) => {
  try {
    const { description } = req.body;
    const dataFormat = {
      data: description,
    };
    const connection = await db.getConnection();
    const [updateCopy] = await connection.query(`UPDATE noah_configs SET data = ? WHERE id = 1`, [JSON.stringify(dataFormat)]);
    connection.release();
    return res.status(200).json({ status: 200, msg: "Update footer page is ok" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ status: 404, msg: "something wen't wrong" });
  }
};
