const express = require("express");
const router = express.Router();
const { resolve } = require("path");
const fs = require("fs");
const controllerHome = require("../controllers/home/index");

router.route("/").get(controllerHome.home);
router.route("/:slug").get(controllerHome.detail);
router.route("/the-loai/:slug").get(controllerHome.categories);
router.route("/:slug/:chapter-ch:id").get(controllerHome.chapters);
router.route("/tags/:slug").get(controllerHome.tags);
router.route("/lich-su/viewer").get(controllerHome.histories);

module.exports = router;
