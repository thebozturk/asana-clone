const TasksService = require("../services/Tasks");
const httpStatus = require("http-status");

class TasksController {
  index = (req, res) => {
    if (!req?.params?.projectId)
      return res.status(httpStatus.BAD_REQUEST).send({
        error: "Project information is missing.",
      });

    TasksService.list({ projectId: req.params.projectId })
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };

  create = (req, res) => {
    req.body.user_id = req.user;
    TasksService.create(req.body)
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
    TasksService.update(req.body, req.params?.id)
      .then((updatedDoc) => {
        res.status(httpStatus.OK).send(updatedDoc);
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was a problem during updating" })
      );
  };

  DeleteTask = (req, res) => {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    }
    TasksService.delete(req.params?.id)
      .then((deletedDoc) => {
        if (!deletedDoc) {
          res.status(httpStatus.NOT_FOUND).send({
            message: "Task not found",
          });
        }
        res.status(httpStatus.OK).send({
          message: "Task deleted successfully",
        });
      })
      .catch((e) =>
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: "There was a problem during deleting" })
      );
  };

  makeComment = async (req, res) => {
    try {
      TasksService.findOne({ _id: req.params.id }).then((mainTask) => {
        if (!mainTask)
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Task not found",
          });

        const comment = {
          ...req.body,
          commented_at: new Date(),
          user_id: req.user,
        };
        mainTask.comments.push(comment);
        mainTask.save().then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        });
      });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during updating" });
    }
  };

  deleteComment = async (req, res) => {
    try {
      findOne({ _id: req.params.id }).then((mainTask) => {
        if (!mainTask)
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Task not found",
          });

        mainTask.comments = mainTask.comments.filter(
          (comment) => comment._id.toString() !== req.params.commentId
        );
        mainTask.save().then((updatedDoc) => {
          return res.status(httpStatus.OK).send(updatedDoc);
        });
      });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during updating" });
    }
  };

  addSubTask = async (req, res) => {
    if (!req.params.id)
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    try {
      TasksService.findOne({ _id: req.params.id }).then((mainTask) => {
        if (!mainTask)
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Task not found",
          });

        insert({ ...req.body, user_id: req.user }).then((subTask) => {
          mainTask.sub_tasks.push(subTask);
          mainTask.save().then((updatedDoc) => {
            return res.status(httpStatus.OK).send(updatedDoc);
          });
        });
      });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during updating" });
    }
  };

  fetchTask = async (req, res) => {
    if (!req.params.id)
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Id information is missing",
      });
    try {
      TasksService.findOne({ _id: req.params.id }).then((task) => {
        if (!task)
          return res.status(httpStatus.NOT_FOUND).send({
            message: "Task not found",
          });

        return res.status(httpStatus.OK).send(task);
      });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during updating" });
    }
  };
}
module.exports = new TasksController();
