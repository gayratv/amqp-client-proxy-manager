import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
// import {AMQPBaseClient} from "@cloudamqp/amqp-client/src/amqp-base-client.js";

/*
 returns singleton contains RMQ connection and chanel
 RMQ describe that need only one connection and one chanel for one thread
 because node is 1 thread app we need only one chanel
 */

export class RmqConnection {
  public connection: AMQPClient;
  public channel: AMQPChannel;

  private static instance: RmqConnection;

  private constructor() {}

  /*
   * инициализирует connection + chanel
   */
  private static async RmqConnection() {
    const rmqConnection = new RmqConnection();

    const amqp = new AMQPClient('amqp://localhost');

    rmqConnection.connection = (await amqp.connect()) as AMQPClient;
    rmqConnection.channel = await rmqConnection.connection.channel();

    /*
     * установить что выбирается только одно сообщение за раз
     * global: boolean – if the prefetch is limited to the channel, or if false to each consumer
     */

    rmqConnection.channel.basicQos(1, 0, false);

    return rmqConnection;
  }

  static async getInstance() {
    if (!RmqConnection.instance) {
      RmqConnection.instance = await RmqConnection.RmqConnection();
    }
    return RmqConnection.instance;
  }

  async closeConnection() {
    if (!RmqConnection.instance) return;
    await this.connection.close();
  }
}
