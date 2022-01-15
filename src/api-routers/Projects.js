const express = require("express");
const ProjectsController = require("../controllers/Projects");
const schemas = require("../validations/Projects");
const validate = require("../middlewares/validate");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

router.route("/").get(authenticateToken, ProjectsController.index);
router
  .route("/")
  .post(
    validate(schemas.createValidation),
    authenticateToken,
    ProjectsController.create
  );
router
  .route("/:id")
  .patch(
    authenticateToken,
    validate(schemas.updateValidation),
    ProjectsController.update
  );
router
  .route("/:id")
  .delete(authenticateToken, ProjectsController.deleteProject);

module.exports = router;
