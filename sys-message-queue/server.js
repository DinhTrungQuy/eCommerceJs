"use strict";

const MessageService = require("./src/services/consumerQueue.service");

const queue = "notificationQueue";
// MessageService.consumerQueue(queue).catch((error) => {
//   console.error(error);
// });

MessageService.consumerQueueNormal().catch((error) => {
  console.error(error);
});

MessageService.consumerQueueDLX().catch((error) => {
  console.log(error);
});
