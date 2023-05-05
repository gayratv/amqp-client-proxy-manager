import { ConsumeMessage } from 'amqplib';
import { BaseResponce, JobWorker, MSGbaseEnquiry, ParamGetProxy, ParamReturnProxy } from '../types/types.js';
import { RMQ_serverQuery } from '../server/server.js';
import { RmqConnection } from '../lib/rmq-connection.js';
import { NLog } from 'tslog-fork';
import { resourceManager } from './resource-manager-instance.js';
import { Proxy } from '../../resource-manage/types/Database.js';
import { delay } from '../../helpers/common.js';

const log = NLog.getInstance();

/*
 * Перед использованием надо забиндить jobWorker
 * workerBase должен вызываться с одним параметром
 */
export async function workerBase<P extends Record<any, unknown>, R>(
  this: RMQ_serverQuery,
  jobWorker: JobWorker<P, R>,
  msg: ConsumeMessage,
) {
  const rcon = await RmqConnection.getInstance();

  const payload: MSGbaseEnquiry = JSON.parse(msg.content.toString());
  log.debug('Получил задание ', msg.content.toString(), ' server receive query ', payload.internalID);
  log.debug(msg);

  // {"leasedTime":3000}
  const usefullData = await jobWorker(payload.params as P);

  // вернуть полученное значение
  const response: BaseResponce = {
    userData: usefullData,
    internalID: payload.internalID,
  };

  rcon.channel.sendToQueue(payload.responseQueueName, Buffer.from(JSON.stringify(response)));

  log.debug('workerBase send ack', payload.internalID);
  await rcon.channel.ack(msg);
}

/*
 * вызов функции которая исполняет конкретное действие
 */
export async function getProxy(params: ParamGetProxy) {
  await delay(10_000);
  log.debug('getProxy return');
  return await resourceManager.getResource<Proxy>(params.leasedTime);
}

export async function returnProxy(params: ParamReturnProxy) {
  return await resourceManager.returnResourceByKey(params.uniqueKey);
}
