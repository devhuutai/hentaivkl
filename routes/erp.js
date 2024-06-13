const express = require("express");
const router = express.Router();
const { resolve } = require("path");
const fs = require("fs");
const controllerIndex = require("../controllers/erp/index");
const controllerCategories = require("../controllers/erp/categories");
const controllerProducts = require("../controllers/erp/products");
const controllerChapters = require("../controllers/erp/chapters");
const controllerConfigs = require("../controllers/erp/configs");

const { checkLogin } = require("../middlewares/users");
const multer = require("multer");
//Format date folder
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}
//Upload thumb products
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolve("./public/thumb")); // Đường dẫn nơi lưu trữ hình ảnh
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Định dạng thời gian
    const fileName = `${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

const dataChapters = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = resolve(`./dataImages/${getCurrentDate()}`);

    // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo mới
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Gán giá trị uploadPath vào biến req.uploadPath để có thể sử dụng ở sau này
    req.uploadPath = uploadPath;

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // Định dạng thời gian
    const fileName = `${timestamp}-${file.originalname}`;
    cb(null, fileName);
  },
});

// Middleware Multer
const uploadchapters = multer({ storage: dataChapters });

//Categories
router.route("/").get(checkLogin, controllerIndex.index);
router.route("/categories/create").get(checkLogin, controllerCategories.creatEdit);
router.route("/categories/delete/:uuid").delete(checkLogin, controllerCategories.deleted);

router.route("/categories").get(checkLogin, controllerCategories.indexCategoriesList);
router.route("/categories/created").post(checkLogin, controllerCategories.create);
router.route("/categories/:slug").get(checkLogin, controllerCategories.edit);
router.route("/categories/edit/:uuid").get(checkLogin, controllerCategories.creatEdit);
router.route("/categories/edited").put(checkLogin, controllerCategories.edit);

//products
router.route("/products").get(controllerProducts.getIndex);
router.route("/products/isTop/:slug").get(controllerProducts.hotProducts);
router.route("/products/create").get(controllerProducts.creatEdit);

//chapters
router.route("/chapters").get(controllerChapters.chapterList);
router.route("/chapters/create").get(controllerChapters.createForm).post(uploadchapters.array("images"), controllerChapters.create);
router.route("/chapters/edit/:uuid").get(controllerChapters.creatEdit);
router.route("/chapters/delete/:uuid").delete(controllerChapters.delete);

//setting

router.route("/configs/home").get(controllerConfigs.home).post(controllerConfigs.editHome);
router.route("/configs/footer").get(controllerConfigs.footers).post(controllerConfigs.editFooter);

module.exports = router;
