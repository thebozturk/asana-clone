const express = require("express");
const {
  index,
  create,
  update,
  deleteSection,
} = require("../controllers/Sections");
const schemas = require("../validations/Sections");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/:projectId").get(authenticateToken, index);
router
  .route("/")
  .post(validate(schemas.createValidation), authenticateToken, create);
router
  .route("/:id")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticateToken, deleteSection);

module.exports = router;
