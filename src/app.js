const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const { ProjectRoutes, UserRoutes } = require("./api-routers");
const loaders = require("./loaders");

config();
loaders();

const app = express();
app.use(express.json());
app.use(helmet());

app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on ${process.env.APP_PORT}`);
  app.use("/projects", ProjectRoutes);
  app.use("/users", UserRoutes);
});
