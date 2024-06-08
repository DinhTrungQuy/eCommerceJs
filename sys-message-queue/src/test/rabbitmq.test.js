"use strict";

const { connectToRabbitMQForTesting } = require("../database/init.rabbit");

describe("RabbitMQ Connection", () => {
  it("should connect to successful RabbitMQ", async () => {
    const result = await connectToRabbitMQForTesting();
    expect(result).toBeUndefined();
  });
});
