const router = require("express").Router();

const authenticate = require("../middleware/authenticate");

const controller = require("../controllers/document.controller");

router.use(authenticate);

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;