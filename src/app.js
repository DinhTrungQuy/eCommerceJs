"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const compression = require("compression");
const initMongodb = require("./v1/databases/init.mongodb");
const LoggerService = require("./v1/Logger/logger.service");
const { NotFoundResponse } = require("./v1/core/error.response");
require("dotenv").config();

//initial database connection
initMongodb();

//middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//add body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//add routes
app.use("/", require("./v1/Routes"));

// handling errors

// 404 not found
app.use((req, res, next) => {
  const error = {
    message: new NotFoundResponse(`404 Not Found Route`),
    status: 404,
  };
  next(error);
});

// global error handler
const logger = LoggerService.createLoggerService();
app.use((error, req, res, next) => {
  logger.exceptionLog(error);
  return res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || "Internal Server Error",
    stack: error.stack || "",
  });
});

module.exports = app;
