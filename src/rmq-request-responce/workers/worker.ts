import { BaseResponce, JobWorker, MSGbaseEnquiry, ParamGetProxy, ParamReturnProxy } from '../types/types.js';
import { RMQ_serverQuery } from '../server/server.js';
import { RmqConnection } from '../lib/rmq-connection.js';
import { NLog } from 'tslog-fork';
import { resourceManager } from './resource-manager-instance.js';
import { Proxy } from '../../resource-manage/types/Database.js';
import { delay } from '../../helpers/common.js';
import { AMQPMessage } from 'amqp-client-fork-gayrat';

const log = NLog.getInstance();
let messageID = 0;

/*
 * Перед использованием надо забиндить jobWorker
 * workerBase должен вызываться с одним параметром
 */
export async function workerBase<P extends Record<any, unknown>, R>(
  this: RMQ_serverQuery,
  jobWorker: JobWorker<P, R>,
  type: string,
  msg: AMQPMessage,
) {
  const rcon = await RmqConnection.getInstance();

  // const payload: MSGbaseEnquiry = JSON.parse(msg.bodyToString());
  const payload = JSON.parse(msg.bodyToString());
  // log.debug('Получил задание deliveryTag : ', msg.deliveryTag, ' routingKey ', msg.routingKey, msg.bodyToString());
  log.debug(
    'задание routingKey ',
    log.sw(msg.routingKey, ['bold', 'blue']),
    'deliveryTag : ',
    msg.deliveryTag,
    msg.bodyToString(),
  );

  const usefullData = await jobWorker(payload);

  // вернуть полученное значение
  const response: BaseResponce = {
    userData: usefullData,
    internalID: payload.internalID,
  };

  await this.channel.basicPublish(this.exchange, msg.properties.replyTo, JSON.stringify(response), {
    deliveryMode: 1,
    correlationId: msg.properties.correlationId,
    replyTo: '',
    messageId: messageID.toString(),
    timestamp: new Date(),
    type: type,
  });
  messageID++;

  log.error('workerBase send ack', msg.deliveryTag);
  await rcon.channel.basicAck(msg.deliveryTag);
}

/*
 * вызов функции которая исполняет конкретное действие
 */
export async function getProxy(params: ParamGetProxy) {
  // await delay(3_000);
  return await resourceManager.getResource<Proxy>(params.leasedTime);
}

export function returnProxy(params: ParamReturnProxy) {
  // boolean
  return resourceManager.returnResourceByKeyNoAwait(params.uniqueKey);
}
