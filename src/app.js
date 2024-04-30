"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const compression = require("compression");
const initMongodb = require("./v1/databases/init.mongodb");
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
    message: new Error(`404 Not Found`),
    status: 404,
  };
  next(error);
});

// global error handler
app.use((error, req, res, next) => {
  console.log(`Error: ${error}`);
  return res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || "Internal Server Error",
    stack: error.stack || "",
  });
});

module.exports = app;
