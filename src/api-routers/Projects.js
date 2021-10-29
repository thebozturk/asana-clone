const express = require("express");
const { route } = require("express/lib/application");
const { create, index } = require("../controllers/Projects");
const schemas = require("../validations/Projects");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", index);
router.route("/").post(validate(schemas.createValidation), create);

module.exports = router;
