var amqp = require("amqplib/callback_api");

const run = async () => {
  amqp.connect("amqp://guest:12345@localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      var queue = "test-topic";
      var msg = "Hello World!";
      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
    }, 500);
  });
};
run();
