import { NLog } from 'tslog-fork';
import { RmqConnection } from './rmq-connection.js';
import { AMQPChannel, AMQPClient } from 'amqp-client-fork-gayrat';

/*
 * порядок использования
 * const a=new RMQ_construct_queues(....);
 * await a.createRMQ_construct_queues()
 */
export class RMQ_construct_exchange {
  public log = NLog.getInstance();
  public connection: AMQPClient;
  public channel: AMQPChannel;

  constructor(public exchange: string, public queueInputName: string, public routingKey: string) {}

  /*
   * инициализирует exchange типа direct
   */
  async createRMQ_construct_exchange() {
    const rcon = await RmqConnection.getInstance();
    this.connection = rcon.connection;
    this.channel = rcon.channel;

    await rcon.channel.exchangeDeclare(this.exchange, 'direct', { durable: false });
  }
}
