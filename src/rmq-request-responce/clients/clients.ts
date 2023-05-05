import { RMQ_clientQueryBase } from './base-clients.js';
import { TIME_WAIT_PROXY_ANSWER } from '../../config/config-rmq.js';
import { BaseResponce } from '../types/types.js';
import { AMQPMessage } from '@cloudamqp/amqp-client';

export class RMQ_proxyClientQuery extends RMQ_clientQueryBase {
  protected registeredCallback = new Map<number, (result?: unknown) => void>();

  private constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * единственный метод получения класса
   */
  static async createRMQ_clientQuery(exchange: string, queueInputName: string, routingKey: string) {
    const cli = new RMQ_proxyClientQuery(exchange, queueInputName, routingKey);

    const bindHandlers = cli.handleResponse.bind(this);
    await cli.createRMQ_clientQueryBase(bindHandlers);

    return cli;
  }

  // от сервера поступили ответы на запросы - надо с ними как то поступить
  private handleResponse = async (msg: AMQPMessage) => {
    const result: BaseResponce = JSON.parse(msg.bodyToString());
    this.log.debug('Получен ответ от сервера  internalID:', result.internalID);
    this.log.debug('Получен ответ от сервера  userData:', result.userData);
    await this.channel.basicAck(msg.deliveryTag);
    // msg.properties.correlationId
    if (msg.properties.correlationId != null) {
      const id = parseInt(msg.properties.correlationId, 10);
      const callBack = this.registeredCallback.get(id);
      this.registeredCallback.delete(id);
      callBack && callBack(result);
    }
  };

  /*
   * послать сообщение обработчику
   * params если определен - то должен быть объектом с ключом
   */
  /*async sendRequest<Tquery_param = Record<string, any>, TreturnResult = unknown>(
    params?: Tquery_param,
  ): Promise<TreturnResult> {
    const internalID = this.internalID++;

    // const msg1: MSGbaseEnquiry = { internalID: 1, responseQueueName: '1', params: { leasedTime: 100 } };

    const msg = Object.assign({ internalID, responseQueueName: this.responceQueueName }, { params: params });
    // this.log.warn(msg);

    this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(msg)));

    return new Promise<TreturnResult>((resolve, reject) => {
      const timerAbortId = setTimeout(() => {
        reject({ err: 'Timeout: истекло время ожидания getproxy' });
      }, TIME_WAIT_PROXY_ANSWER);

      const callback = (result?: TreturnResult) => {
        clearTimeout(timerAbortId);
        resolve(result);
      };
      this.registeredCallback.set(internalID, callback);
    });
  }*/

  /*
   * послать только сообщение обработчику
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequestOnly<Tquery_param = Record<string, any>>(params?: Tquery_param): Promise<void> {
    const internalID = this.internalID++;

    // const msg = Object.assign({ internalID, responseQueueName: this.responceQueueName }, { params: params });
    const msg = params;
    // this.log.warn(msg);

    await this.channel.basicPublish(this.exchange, this.routingKey, JSON.stringify(msg), {
      deliveryMode: 1,
      correlationId: internalID.toString(),
      replyTo: this.responceQueueName,
      messageId: internalID.toString(),
      timestamp: new Date(),
      type: 'getProxy',
    });
  }
}
