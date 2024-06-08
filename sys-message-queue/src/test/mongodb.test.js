"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/shop_dev";
const testSchema = mongoose.Schema({ name: String });
const test = mongoose.model("Test", testSchema);

describe("Mongoose Connection", () => {
  let connection;
  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });
  afterAll(async () => {
    await connection.disconnect();
  });
  it("should connect to mongoose", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
  it("should save a document", async () => {
    const doc = new test({ name: "Lecy" });
    await doc.save();
    expect(doc.isNew).toBe(false);
  });
  it("should create a new document", async () => {
    const doc = await test.findOne({ name: "Lecy" });
    expect(doc).toBeDefined();
    expect(doc.name).toBe("Lecy");
  });
});
