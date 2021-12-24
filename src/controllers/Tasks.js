const { insert, list, modify, remove, findOne } = require("../services/Tasks");
const httpStatus = require("http-status");

const index = (req, res) => {
  if (!req?.params?.projectId)
    return res.status(httpStatus.BAD_REQUEST).send({
      error: "Project information is missing.",
    });

  list({ projectId: req.params.projectId })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  modify(req.body, req.params?.id)
    .then((updatedDoc) => {
      res.status(httpStatus.OK).send(updatedDoc);
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "There was a problem during updating" })
    );
};

const DeleteTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  }
  remove(req.params?.id)
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

const makeComment = async (req, res) => {
  try {
    findOne({ _id: req.params.id }).then((mainTask) => {
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

const deleteComment = async (req, res) => {
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

const addSubTask = async (req, res) => {
  if (!req.params.id)
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  try {
    findOne({ _id: req.params.id }).then((mainTask) => {
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

const fetchTask = async (req, res) => {
  if (!req.params.id)
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Id information is missing",
    });
  try {
    findOne({ _id: req.params.id }).then((task) => {
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

module.exports = {
  create,
  index,
  update,
  DeleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask,
};
