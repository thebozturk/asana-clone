const httpStatus = require("http-status");
const SectionService = require("../services/Sections");

class SectionsController {
  index = (req, res) => {
    if (!req?.params?.projectId)
      return res.status(httpStatus.BAD_REQUEST).send({
        error: "Project information is missing.",
      });

    SectionService.list({ projectId: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  create = (req, res) => {
    req.body.user_id = req.user;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };

  update = (req, res) => {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    }
    SectionService.update(req.params?.id, req.body)
      .then((updatedDoc) => {
        if (!updatedDoc) {
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Section not found",
          });
        }
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was a problem during updating" })
      );
  };

  deleteSection = (req, res) => {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    }
    SectionService.delete(req.params?.id)
      .then((deletedDoc) => {
        if (!deletedDoc) {
          res.status(httpStatus.NOT_FOUND).send({
            message: "Section not found",
          });
        }
        res.status(httpStatus.OK).send({
          message: "Section deleted successfully",
        });
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was a problem during deleting" })
      );
  };
}

module.exports = new SectionsController();
