"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const compression = require("compression");
const initMongodb = require("./databases/init.mongodb");
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

module.exports = app;
