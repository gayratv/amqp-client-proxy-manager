import { RMQ_clientQueryBase } from './base-clients.js';
import { TIME_WAIT_PROXY_ANSWER } from '../../config/config-rmq.js';
import { BaseResponce } from '../types/types.js';
import { AMQPMessage } from '@cloudamqp/amqp-client';
import { LoggerLevel } from 'tslog-fork';

export class RMQ_proxyClientQuery extends RMQ_clientQueryBase {
  protected registeredCallback = new Map<number, (result?: unknown) => void>();

  /*
  export enum LoggerLevel {
  silly,
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
}
   */
  private constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
    this.log.minLevel = LoggerLevel.info;
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
    this.log.debug(
      'Получен ответ от сервера  deliveryTag:',
      msg.deliveryTag,
      ' correlationId ',
      msg.properties.correlationId,
      ' BaseResponce ',
      msg.bodyToString(),
    );
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
   * послать сообщение  обработчику и получить ответ
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequestAndResieveAnswer<Tquery_param = Record<string, any>, TreturnResult = unknown>(
    params?: Tquery_param,
  ): Promise<TreturnResult> {
    const internalID = this.internalID++;

    const msg = params;

    await this.channel.basicPublish(this.exchange, this.routingKey, JSON.stringify(msg), {
      deliveryMode: 1,
      correlationId: internalID.toString(),
      replyTo: this.responceQueueName,
      messageId: internalID.toString(),
      timestamp: new Date(),
      type: 'getProxy',
    });

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
   * послать только сообщение обработчику
   * params если определен - то должен быть объектом с ключом
   */
  async sendRequestOnly<Tquery_param = Record<string, any>>(params?: Tquery_param): Promise<void> {
    const internalID = this.internalID++;

    const msg = params;

    await this.channel.basicPublish(this.exchange, this.routingKey, JSON.stringify(msg), {
      deliveryMode: 1,
      correlationId: internalID.toString(),
      replyTo: this.responceQueueName,
      messageId: internalID.toString(),
      timestamp: new Date(),
      type: 'getProxy',
    });
    this.log.info('Запрос correlationId', internalID);
  }
}
