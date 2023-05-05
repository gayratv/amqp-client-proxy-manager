// сообщение запроса proxy
import { ConsumeMessage } from 'amqplib';
import { RMQ_serverQuery } from '../server/server.js';
import { Proxy } from '../../resource-manage/types/Database.js';
import { ProxyObject } from '../../resource-manage/index.js';
import { RMQ_proxyClientQuery } from '../clients/clients.js';

export interface MSGbaseEnquiry<Parm extends Record<string, unknown> = {}> {
  responseQueueName: string; // имя очереди для ответа
  internalID?: number; // внутренний номер запроса - по нему будет идти сопоставление ответов
  params?: Parm;
}

export type ParamGetProxy = { leasedTime: number };
export type GetProxyReturn = BaseResponce<ProxyObject<Proxy>>;

export type ParamReturnProxy = { uniqueKey: string | number };

// export interface MSGproxyEnquiry extends MSGbaseEnquiry {
//   leasePeriod?: number; // время аренды
// }

export interface MSGreturnProxyEnquiry extends MSGbaseEnquiry {
  uniqueKey: string | number;
}

export interface BaseResponce<T = unknown> {
  internalID?: number; // тот же самый номер который поступил при запросе
  userData: T; // возвращаемые пользовательские данные
}

/*
export interface ProxyResponce extends BaseResponce {
  proxy: ProxyObject<Proxy>;
}
export interface ProxyReturnResponce extends BaseResponce {
  status: boolean;
}
*/

export type Worker<P extends Record<any, unknown>, R> = (
  this: RMQ_serverQuery,
  jobWorker: JobWorker<P, R>,
  msg: ConsumeMessage,
) => Promise<void>;
export type ClientHandler = (this: RMQ_proxyClientQuery, msg: ConsumeMessage) => Promise<void>;

export type JobWorker<P extends Record<any, unknown>, R> = (params: P) => Promise<R>;
