const express = require("express");
const {
  create,
  update,
  DeleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask,
} = require("../controllers/Tasks");
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
router
  .route("/:id/make-comment")
  .post(authenticateToken, validate(schemas.commentValidation), makeComment);
router.route("/:id/:commentId").delete(authenticateToken, deleteComment);
router
  .route("/:id/add-sub-task")
  .post(validate(schemas.createValidation), authenticateToken, addSubTask);
router.route("/:id").get(authenticateToken, fetchTask);

module.exports = router;
