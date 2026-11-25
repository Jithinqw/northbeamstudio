const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/documents", require("./document.routes"));

module.exports = router;