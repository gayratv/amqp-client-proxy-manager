import { ConsumeMessage } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { RMQ_construct_queues } from '../lib/base-req-res.js';
import { ClientHandler } from '../types/types.js';

export class RMQ_clientQueryBase extends RMQ_construct_queues {
  protected internalID = 0;
  public responceQueueName: string; // для каждого клиента создается уникальная очередь

  constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * вызвать после new
   */
  async createRMQ_clientQueryBase(handleResponse: ClientHandler) {
    await this.createRMQ_construct_queues();
    await this.initPrivateQueueForResponses();

    // responseQueueName - в эту очередь поступают ответы от сервера
    await this.channel.consume(this.responceQueueName, handleResponse, { noAck: false });
  }

  // инициализировать очередь для ответов от сервера
  private async initPrivateQueueForResponses() {
    this.responceQueueName = `proxy-${uuidv4()}`;
    await this.channel.assertQueue(this.responceQueueName, {
      exclusive: true,
      autoDelete: true,
    });
  }
}
