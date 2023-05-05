import { AMQPClient } from '@cloudamqp/amqp-client';

async function run() {
  // try {
  const amqp = new AMQPClient('amqp://localhost');
  const conn = await amqp.connect();
  const ch = await conn.channel();
  const q = await ch.queue('q1', { passive: false, durable: false });

  await ch.exchangeDeclare('ex1', 'direct', { durable: false });

  await ch.queueBind('q1', 'ex1', 'q1routKey');

  const consumer = await q.subscribe({ noAck: true }, async (msg) => {
    console.log(msg.bodyToString());
    console.log(msg.properties);
    // await consumer.cancel();
  });

  // await q.publish('Hello World', { deliveryMode: 2 });
  ch.basicPublish('ex1', 'q1routKey', 'exchange publish', {
    deliveryMode: 1,
    correlationId: '111',
    replyTo: 'que to reply',
    messageId: '805',
    timestamp: new Date(),
    type: 'returnProxy',
  });

  ch.basicPublish('ex1', 'q1routKey', 'exchange publish', {
    deliveryMode: 1,
    correlationId: '112',
    replyTo: 'que to reply2',
    messageId: '11',
    timestamp: new Date(),
    type: 'returnProxy',
  });

  // await consumer.wait(); // will block until consumer is canceled or throw an error if server closed channel/connection
  // await conn.close();
  /*  } catch (e) {
    console.error('ERROR', e);
    e.connection.close();
    setTimeout(run, 1000); // will try to reconnect in 1s
  }*/
}

run();
