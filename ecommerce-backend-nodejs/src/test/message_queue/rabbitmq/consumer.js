var amqp = require("amqplib/callback_api");

const run = async () => {
  amqp.connect("amqp://guest:12345@localhost", (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      var queue = "hello";
      channel.assertQueue(queue, { durable: true });
      channel.consume(
        queue,
        (msg) => {
          console.log(" [x] Received %s", msg.content.toString());
        },
        { noAck: true }
      );
    });
  });
};
run();
