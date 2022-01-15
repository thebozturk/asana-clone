const BaseService = require("./BaseService");
const BaseModel = require("../models/Tasks");

class Task extends BaseService {
  constructor() {
    super(BaseModel);
  }
  list(where) {
    return BaseModel.find(where || {}).populate({
      path: "user_id",
      select: "full_name email profile_image",
    });
  }

  findOne = (where, expand) => {
    if (!expand) return Task.findOne(where);
    return Task.findOne(where)
      .populate({
        path: "user_id",
        select: "full_name email profile_image",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "full_name email profile_image",
        },
      })
      .populate({
        path: "sub_tasks",
        select:
          "title description, isCompleted, assigned_to due_date order sub_tasks statuses",
      });
  };
}

module.exports = new Task();
