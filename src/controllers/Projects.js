const httpStatus = require("http-status");
const ProjectService = require("../services/Projects");
const ApiError = require("../errors/ApiError");

class ProjectsController {
  index = (req, res) => {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  create = (req, res) => {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };

  update = (req, res, next) => {
    console.log(req.params.id);
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    }
    ProjectService.update(req.params.id, req.body)
      .then((updatedProject) => {
        if (updatedProject) {
          return next(new ApiError("Project not found", httpStatus.NOT_FOUND));
        }
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) => next(new ApiError(e.message)));
  };

  deleteProject = (req, res) => {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    }
    ProjectService.delete(req.params.id)
      .then((deletedProject) => {
        console.log(deletedProject);
        if (!deleteProject) {
          res.status(httpStatus.NOT_FOUND).send({
            message: "Project not found",
          });
        }
        res.status(httpStatus.OK).send({
          message: "Project deleted successfully",
        });
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was a problem during deleting" })
      );
  };
}

module.exports = new ProjectsController();
