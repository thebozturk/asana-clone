const express = require("express");
const UsersController = require("../controllers/Users");
const schemas = require("../validations/Users");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const idChecker = require("../middlewares/idChecker");

const router = express.Router();

router.get("/", UsersController.index);
router
  .route("/")
  .post(validate(schemas.createValidation), UsersController.create);
router
  .route("/login")
  .post(validate(schemas.loginValidation), UsersController.login);
router.route("/projects").get(authenticate, UsersController.projectList);
router
  .route("/")
  .patch(
    authenticate,
    validate(schemas.updateValidation),
    UsersController.update
  );
router
  .route("/reset-password")
  .post(
    validate(schemas.resetPasswordValidation),
    UsersController.resetPassword
  );
router
  .route("/:id")
  .delete(idChecker(), authenticate, UsersController.deleteUser);
router
  .route("/change-password")
  .post(
    authenticate,
    validate(schemas.changePasswordValidation),
    UsersController.changePassword
  );
router
  .route("/update-profile-image")
  .post(authenticate, UsersController.updateProfileImage);
module.exports = router;
