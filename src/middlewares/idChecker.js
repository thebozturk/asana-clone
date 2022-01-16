const ApiError = require("../errors/ApiError");
const httpStatus = require("http-status");

const idChecker = (field) => (id, res, next) => {
  return (req, res, next) => {
    const idField = field || "id";
    if (req.params[idField].match(/^[0-9a-fA-F]{24}$/)) {
      next(new ApiError("Id is not valid", httpStatus.BAD_REQUEST));
    } else {
      res.status(400).json({
        message: "Invalid id",
      });
    }
    next();
  };
};

module.exports = idChecker;
