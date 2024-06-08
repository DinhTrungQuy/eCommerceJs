"use strict";
const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    if (!connection) {
      throw new Error("Can not connect to RabbitMQ");
    }
    const channel = await connection.createChannel();
    if (!channel) {
      throw new Error("Can not create channel");
    }
    return { connection, channel };
  } catch (error) {}
};

const connectToRabbitMQForTesting = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    const queue = "test-topic";
    const message = "Hello, world!";
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  } catch (error) {
    console.log(`Error connecting to RabbitMQ`);
  }
};

const consumerQueue = async (channel, queue) => {
  try {
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(
      queue,
      (msg) => {
        console.log(" [x] Received %s", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(`Error consuming queue`);
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTesting,
  consumerQueue,
};
