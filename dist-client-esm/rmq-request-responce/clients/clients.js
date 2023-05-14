import { RMQ_clientQueryBase } from './base-clients.js';
import { TIME_WAIT_PROXY_ANSWER } from '../../config/config-rmq.js';
export class RMQ_proxyClientQuery extends RMQ_clientQueryBase {
    registeredCallback = new Map();
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
    constructor(exchange, queueInputName, routingKey) {
        super(exchange, queueInputName, routingKey);
        // this.log.minLevel = LoggerLevel.info;
    }
    /*
     * единственный метод получения класса
     */
    static async createRMQ_clientQuery(exchange, queueInputName, routingKey) {
        const cli = new RMQ_proxyClientQuery(exchange, queueInputName, routingKey);
        const bindHandlers = cli.handleResponse.bind(this);
        await cli.createRMQ_clientQueryBase(bindHandlers);
        return cli;
    }
    // от сервера поступили ответы на запросы - надо с ними как то поступить
    handleResponse = async (msg) => {
        const result = JSON.parse(msg.bodyToString());
        /*  this.log.debug(
          'Получен ответ от сервера  deliveryTag:',
          msg.deliveryTag,
          ' correlationId ',
          msg.properties.correlationId,
          ' BaseResponce ',
          msg.bodyToString(),
        );*/
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
    async sendRequestAndResieveAnswer(routingKey, params) {
        const internalID = this.internalID++;
        const msg = params;
        await this.channel.basicPublish(this.exchange, routingKey, JSON.stringify(msg), {
            deliveryMode: 1,
            correlationId: internalID.toString(),
            replyTo: this.responceQueueName,
            messageId: internalID.toString(),
            timestamp: new Date(),
            type: 'getProxy',
        });
        return new Promise((resolve, reject) => {
            const timerAbortId = setTimeout(() => {
                reject({ err: 'Timeout: истекло время ожидания getproxy' });
            }, TIME_WAIT_PROXY_ANSWER);
            const callback = (result) => {
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
    async sendRequestOnly(routingKey, params) {
        const internalID = this.internalID++;
        await this.channel.basicPublish(this.exchange, routingKey, JSON.stringify(params), {
            deliveryMode: 1,
            correlationId: internalID.toString(),
            replyTo: this.responceQueueName,
            messageId: internalID.toString(),
            timestamp: new Date(),
            type: 'getProxy',
        });
        // this.log.info('Запрос correlationId', internalID);
    }
}
//# sourceMappingURL=clients.js.map