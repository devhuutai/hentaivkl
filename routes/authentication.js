const express = require("express");
const router = express.Router();
const controllerIndex = require("../controllers/auth/authentication");

router.route("/").get(controllerIndex.loginPage).post(controllerIndex.login);

module.exports = router;
