const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/publicationController");

router.post("/", auth, controller.create);
router.get("/", controller.listApproved);

module.exports = router;
