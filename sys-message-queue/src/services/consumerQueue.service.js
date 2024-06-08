"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../database/init.rabbit");

class MessageService {
  static async consumerQueue(queue) {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queue);
    } catch (error) {
      console.log(`Error in consumerQueue`, error);
    }
  }

  static async consumerQueueNormal() {
    try {
      const { channel } = await connectToRabbitMQ();

      const notificationQueue = "notificationQueue";

      channel.consume(notificationQueue, (msg) => {
        if (msg) {
          console.log(
            `[x] Received notificationQueue: ${msg.content.toString()}`
          );
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.log(`Error normal`, error);
      throw new Error(error);
    }
  }

  static async consumerQueueDLX() {
    try {
      const { channel } = await connectToRabbitMQ();

      const notificationDLXExchange = "notificationDLXExchange";
      const notificationDLXRoutingKey = "notificationDLXRoutingKey";
      const notificationDLXQueue = "notificationDLXQueue";
      await channel.assertExchange(notificationDLXExchange, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationDLXQueue, {
        durable: true,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationDLXExchange,
        notificationDLXRoutingKey
      );

      channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg) {
            console.log(
              `[x] Received notificationDLXQueue: ${msg.content.toString()}`
            );
          }
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.log(`Error DLX`, error);
      throw new Error(error);
    }
  }
}

module.exports = MessageService;
