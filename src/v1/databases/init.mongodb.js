const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

class InitMongoDb {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        console.log("MongoDB connected");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!InitMongoDb.instance) {
      InitMongoDb.instance = new InitMongoDb();
    }
    InitMongoDb.instance = this;
    return InitMongoDb.instance;
  }
}

module.exports = InitMongoDb.getInstance;
