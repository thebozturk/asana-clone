const express = require("express");
const { create, update, DeleteTask } = require("../controllers/Tasks");
const schemas = require("../validations/Tasks");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .post(validate(schemas.createValidation), authenticateToken, create);
router
  .route("/:id")
  .patch(authenticateToken, validate(schemas.updateValidation), update);
router.route("/:id").delete(authenticateToken, DeleteTask);

module.exports = router;
