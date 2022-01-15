const httpStatus = require("http-status");
const UserService = require("../services/Users");
const ProjectService = require("../services/Projects");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");

class UsersController {
  create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };

  login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    UserService.findOne(req.body)
      .then((user) => {
        if (!user)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found." });

        user = {
          ...user.toObject(),
          tokens: {
            access_token: generateAccessToken(user),
            refresh_roken: generateRefreshToken(user),
          },
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  index = (req, res) => {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  projectList = (req, res) => {
    ProjectService.list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  resetPassword = (req, res) => {
    const new_password =
      uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
    UserService.updateWhere(
      { email: req.body.email },
      { password: passwordToHash(new_password) }
    )
      .then((updateUser) => {
        if (!updateUser)
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ error: "There is no user." });
        eventEmitter.emit("send_email", {
          to: updateUser.email,
          subject: "Reset Password",
          html: `Your password has been reset <br/> Do not forget to change your password after logging in. <br/> Your new password: <b>${new_password}</b> `,
        });
        res.status(httpStatus.OK).send({
          message:
            "We have sent the information required for the password reset process to your e-mail address.",
        });
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was an problem during the reset password," })
      );
  };

  update = (req, res) => {
    UserService.update({ _id: req.user?._id }, req.body)
      .then((updateUser) => {
        res.status(httpStatus.OK).send(updateUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "A problem occurred during the update process" })
      );
  };

  deleteUser = (req, res) => {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    }
    UserService.delete(req.params.id)
      .then((deletedUser) => {
        console.log(deletedUser);
        if (!deleteUser) {
          res.status(httpStatus.NOT_FOUND).send({
            message: "User not found",
          });
        }
        res.status(httpStatus.OK).send({
          message: "User deleted successfully",
        });
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was a problem during deleting" })
      );
  };

  changePassword = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    UserService.update({ _id: req.user?._id }, req.body)
      .then((updateUser) => {
        res.status(httpStatus.OK).send(updateUser);
      })
      .catch(() =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "A problem occurred during the update process" })
      );
  };

  updateProfileImage = (req, res) => {
    // File Control
    if (!req?.files?.profile_image) {
      return res.status(httpStatus.BAD_REQUEST).send({
        error: "You do not have enough data to perform this operation.",
      });
    }
    const extension = path.extname(req.files.profile_image.name);

    const fileName = `${req?.user?._id}${extension}`;

    // Upload File
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
    req.files.profile_image.mv(folderPath, function (err) {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: err,
        });
      }
      UserService.update({ _id: req.user?._id }, { profile_image: fileName })
        .then((updateUser) => {
          res.status(httpStatus.OK).send(updateUser);
        })
        .catch((e) =>
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error:
              "The installation was successful but there was a problem during the update",
          })
        );
    });
  };
}

module.exports = new UsersController();
