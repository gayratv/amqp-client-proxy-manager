import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_exchange } from '../lib/base-req-res.js';
import { ClientHandler } from '../types/types.js';

export class RMQ_clientQueryBase extends RMQ_construct_exchange {
  protected internalID = 0;
  public responceQueueName: string; // для каждого клиента создается уникальная очередь

  constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * вызвать после new
   */
  async createRMQ_clientQueryBase(handleResponse: ClientHandler) {
    await this.createRMQ_construct_exchange();
    await this.initPrivateQueueForResponses(handleResponse);
  }

  // инициализировать очередь для ответов от сервера
  private async initPrivateQueueForResponses(handleResponse: ClientHandler) {
    this.responceQueueName = `proxy-${uuidv4()}`;

    const q = await this.channel.queue(this.responceQueueName, { passive: false, durable: false, autoDelete: true });
    await this.channel.queueBind(this.responceQueueName, this.exchange, this.responceQueueName);

    // responseQueueName - в эту очередь поступают ответы от сервера
    const consumer = await q.subscribe({ noAck: false }, handleResponse);
  }
}
