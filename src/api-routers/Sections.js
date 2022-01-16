const express = require("express");
const SectionsController = require("../controllers/Sections");
const schemas = require("../validations/Sections");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");

const router = express.Router();

router.route("/:projectId").get(authenticateToken, SectionsController.index);
router
  .route("/")
  .post(
    validate(schemas.createValidation),
    authenticateToken,
    SectionsController.create
  );
router
  .route("/:id")
  .patch(
    idChecker(),
    authenticateToken,
    validate(schemas.updateValidation),
    SectionsController.update
  );
router
  .route("/:id")
  .delete(idChecker(), authenticateToken, SectionsController.deleteSection);

module.exports = router;
