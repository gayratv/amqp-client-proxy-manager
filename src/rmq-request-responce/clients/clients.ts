import { RMQ_clientQueryBase } from './base-clients.js';
import { ConsumeMessage } from 'amqplib';
import { TIME_WAIT_PROXY_ANSWER } from '../../config/config-rmq.js';
import { BaseResponce, MSGbaseEnquiry } from '../types/types.js';

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
    await cli.createRMQ_clientQueryBase(cli.handleResponse);

    return cli;
  }

  // от сервера поступили ответы на запросы - надо с ними как то поступить
  private handleResponse = async (msg: ConsumeMessage) => {
    const result: BaseResponce = JSON.parse(msg.content.toString());
    this.log.debug('Получен ответ от сервера  internalID:', result.internalID);
    this.log.debug('Получен ответ от сервера  userData:', result.userData);
    this.channel.ack(msg);
    if (result.internalID != null) {
      const callBack = this.registeredCallback.get(result.internalID);
      this.registeredCallback.delete(result.internalID);
      callBack && callBack(result);
    }
  };

  /*
   * послать сообщение обработчику
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequest<Tquery_param = Record<string, any>, TreturnResult = unknown>(
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
  }

  /*
   * послать только  сообщение обработчику
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequestOnly<Tquery_param = Record<string, any>>(params?: Tquery_param): Promise<void> {
    const internalID = this.internalID++;

    const msg = Object.assign({ internalID, responseQueueName: this.responceQueueName }, { params: params });
    // this.log.warn(msg);

    this.channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(msg)));
  }
}
