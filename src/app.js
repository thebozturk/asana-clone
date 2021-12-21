const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const config = require("./config");
const { ProjectRoutes, UserRoutes, SectionRoutes } = require("./api-routers");
const events = require("./scripts/events");
const loaders = require("./loaders");
const path = require("path");

config();
loaders();
events();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on ${process.env.APP_PORT}`);
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
  app.use("/sections", SectionRoutes);
});
