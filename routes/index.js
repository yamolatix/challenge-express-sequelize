const express = require("express");
const router = express.Router();

const articleRoutes = require("./articles")

router.use("/articles", articleRoutes)

module.exports = router;
