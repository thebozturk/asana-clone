const express = require("express");
const {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
} = require("../controllers/Users");
const schemas = require("../validations/Users");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);
router.route("/login").post(validate(schemas.loginValidation), login);
router.route("/projects").get(authenticate, projectList);
router
  .route("/")
  .patch(authenticate, validate(schemas.updateValidation), update);
router
  .route("/reset-password")
  .post(validate(schemas.resetPasswordValidation), resetPassword);
router.route("/:id").delete(authenticate, deleteUser);
router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    changePassword
  );
router.route("/update-profile-image").post(authenticate, updateProfileImage);
module.exports = router;
