const express = require("express");
const {
  create,
  index,
  update,
  deleteProject,
} = require("../controllers/Projects");
const schemas = require("../validations/Projects");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(authenticateToken, index);
router
  .route("/")
  .post(validate(schemas.createValidation), authenticateToken, create);
router
  .route("/:id")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticateToken, deleteProject);

module.exports = router;
