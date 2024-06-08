"use strict";

var amqp = require("amqplib");

const run = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationExchange";
    const notificationQueue = "notificationQueue";
    const notificationDLXExchange = "notificationDLXExchange";
    const notificationDLXQueue = "notificationDLXQueue";
    const notificationDLXRoutingKey = "notificationDLXRoutingKey";

    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });
    const queueResult = await channel.assertQueue(notificationQueue, {
      durable: true,
      deadLetterExchange: notificationDLXExchange,
      deadLetterRoutingKey: notificationDLXRoutingKey,
    });
    await channel.bindQueue(queueResult.queue, notificationExchange, "");

    const msg = `[x] Sent ${new Date().toISOString()}`;
    const expiration = "3000";

    channel.sendToQueue(notificationQueue, Buffer.from(msg), {
      expiration: expiration,
    });
    console.log(`Message sent: ${msg} with expiration: ${expiration}ms`);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(`Error connecting to RabbitMQ::: ${error}`);
  }
};

run().catch(console.error);
