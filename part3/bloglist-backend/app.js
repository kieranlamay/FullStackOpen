const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const app = express();
app.use(express.json());

logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);

module.exports = app;
