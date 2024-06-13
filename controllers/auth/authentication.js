const { resolve } = require("path");
const db = require("./../../utils/database");
const { generateToken, comparePassword, verifyToken, hashPassword } = require("./../../utils");

exports.loginPage = async (req, res) => {
  try {
    const token = req.cookies.Bearer;
    if (!token) {
      return res.render(`${resolve("./views/erp/login/index")}`);
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    userFormat = {
      id: decoded.id,
    };
    return res.redirect("/erp");
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    if (password) {
      const connection = await db.getConnection();
      const [[data]] = await connection.query(`SELECT * FROM noah_users WHERE id = '1'`);

      if (!data) {
        connection.release();
        return res.redirect("/");
      }
      const checkPassword = await comparePassword(password, data.password);

      if (!checkPassword) {
        connection.release();
        return res.redirect("/");
      }
      const objectInfo = {
        id: data.id,
      };

      const token = generateToken(objectInfo);
      connection.release();
      res.cookie("Bearer ", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
      res.status(200).json({ data: objectInfo });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Something wen't wrong" });
  }
};
exports.getMe = async (req, res) => {};
