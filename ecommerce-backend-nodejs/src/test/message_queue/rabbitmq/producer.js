var amqp = require("amqplib/callback_api");

const run = async () => {
  amqp.connect("amqp://guest:12345@localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      var queue = "hello";
      var msg = "Hello World!";
      channel.assertQueue(queue, { durable: true });
      for (let index = 0; index < 1000000; index++) {
        channel.sendToQueue(queue, Buffer.from(msg + " " + index));
      }
      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });
};
run();
