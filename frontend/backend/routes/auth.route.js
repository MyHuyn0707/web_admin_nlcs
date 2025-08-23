const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

module.exports = router;
