import { RMQ_serverQuery } from '../server/server.js';
import { Proxy } from '../../resource-manage/types/Database.js';
import { ProxyObject } from '../../resource-manage/index.js';
import { RMQ_proxyClientQuery } from '../clients/clients.js';
import { AMQPMessage } from 'amqp-client-fork-gayrat';
export interface MSGbaseEnquiry<Parm extends Record<string, unknown> = {}> {
    responseQueueName: string;
    internalID?: number;
    params?: Parm;
}
export type ParamGetProxy = {
    leasedTime: number;
};
export type GetProxyReturn = BaseResponce<ProxyObject<Proxy>>;
export type ParamReturnProxy = {
    uniqueKey: string | number;
};
export interface MSGreturnProxyEnquiry extends MSGbaseEnquiry {
    uniqueKey: string | number;
}
export interface BaseResponce<T = unknown> {
    internalID?: number;
    userData: T;
}
export type Worker<P extends Record<any, unknown>, R> = (this: RMQ_serverQuery, jobWorker: JobWorker<P, R>, type: string, msg: AMQPMessage) => Promise<void>;
export type ClientHandler = (this: RMQ_proxyClientQuery, msg: AMQPMessage) => Promise<void>;
export type JobWorker<P extends Record<any, unknown>, R> = (params: P) => Promise<R>;
