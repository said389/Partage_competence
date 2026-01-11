const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const controller = require("../controllers/publicationController");

router.get("/competences", auth, admin, controller.getPending);
router.get("/competences/:id", auth, admin, controller.getOne);
router.put("/competences/:id/accepter", auth, admin, controller.accept);
router.put("/competences/:id/refuser", auth, admin, controller.refuse);

router.delete("/competences/:id", auth, admin, controller.deleteCompetence);


module.exports = router;
