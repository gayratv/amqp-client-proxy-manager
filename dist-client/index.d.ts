/// <reference types="node" resolution-mode="require"/>
declare module 'rmq-request-responce/lib/rmq-connection' {
  import { AMQPClient, AMQPChannel } from 'amqp-client-fork-gayrat';
  export class RmqConnection {
    connection: AMQPClient;
    channel: AMQPChannel;
    private static instance;
    private constructor();
    private static RmqConnection;
    static getInstance(): Promise<RmqConnection>;
    closeConnection(): Promise<void>;
  }
}
declare module 'rmq-request-responce/lib/base-req-res' {
  import { NLog } from 'tslog-fork';
  import { AMQPChannel, AMQPClient } from 'amqp-client-fork-gayrat';
  export class RMQ_construct_exchange {
    exchange: string;
    queueInputName: string;
    routingKey: string;
    log: NLog;
    connection: AMQPClient;
    channel: AMQPChannel;
    constructor(exchange: string, queueInputName: string, routingKey: string);
    createRMQ_construct_exchange(): Promise<void>;
  }
}
declare module 'rmq-request-responce/server/server' {
  import { RMQ_construct_exchange } from 'rmq-request-responce/lib/base-req-res';
  import { JobWorker, Worker } from 'rmq-request-responce/types/types';
  export class RMQ_serverQuery extends RMQ_construct_exchange {
    private constructor();
    static createRMQ_serverQuery<P extends Record<any, unknown>, R>(
      exchange: string,
      queueInputName: string,
      routingKey: string,
      worker: Worker<P, R>,
      jobWorker: JobWorker<P, R>,
    ): Promise<RMQ_serverQuery>;
    private consumeRequest;
    addQueues<P extends Record<any, unknown>, R>(
      queueName: string,
      worker: Worker<P, R>,
      jobWorker: JobWorker<P, R>,
    ): Promise<void>;
  }
}
declare module 'resource-manage/types/Database' {
  import { RowDataPacket } from 'mysql2';
  export interface customer_queryEntity extends RowDataPacket {
    /** id заказчика - UUID V4 */
    fkCustomer: string;
    /** этот профиль будет использоваться для сканирования запроса */
    fkUserProfile: number;
    idСustomerQuery?: number;
    /** комментарий пользователя */
    name: string;
    url: string;
  }
  export interface customersEntity {
    /** коментарии  */
    description: string | null;
    /** id заказчика - UUID V4 */
    idCustomer: string;
    /** наименование Закачика */
    name: string;
    timestamp?: Date;
  }
  export interface adsOneAdEntity {
    author: string | null;
    authorId: string | null;
    datePublish: string | null;
    fkQueryExecutions: string;
    idAd: string | null;
    idOneAd?: string;
    sellerRating: string | null;
    sellerRewievs: string | null;
    timestamp?: Date;
    title: string | null;
    todayView: string | null;
    totalView: string | null;
  }
  export interface adsJobsEntity {
    idJob: number;
    fkCustomerQuery: number;
    cntPagesInQuery?: number;
    timestamp?: Date;
  }
  export interface Proxy {
    server: string;
    username: string;
    password: string;
  }
  export interface BaseSite {
    baseSite: Array<string>;
  }
  export interface Cookies {
    name: string;
    path: string;
    value: string;
    domain: string;
    secure: boolean;
    expires: number;
    httpOnly: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }
  interface Origin {
    origin: string;
    localStorage: Array<{
      name: string;
      value: string;
    }>;
  }
  export type CookiesList = {
    cookies: Cookies[];
    origins: Origin[];
  };
  export interface user_profilesEntity extends RowDataPacket {
    idUser: number;
    /** основной сайт на который надо переходить обновлять куки это массив сайтов - надо будет прохоить по ним всем  */
    baseSite?: BaseSite;
    cookies?: CookiesList;
    /** коментарии профиля */
    description?: string;
    fingerprint?: any;
    /** id заказчика - UUID V4 */
    idCustomer?: string;
    /** наименование профиля */
    name?: string;
    timestamp?: Date;
    proxyServer?: Proxy;
  }
  export interface proxyListEntity extends RowDataPacket {
    /** для какого профиля назначен этот proxy */
    assignedToProfile: number | null;
    idProxyList: number;
    /** какой сервер предотсавляет proxy */
    proxyProvider?: string;
    proxyServer: any;
    proxyServerBlocked: number;
    timestamp: Date;
    /** исходная строка webshare */
    webshareSrcString: string | null;
    comments: string | null;
    checkedForAvito: number | null;
  }
  export interface webShareProxyListApiEntity extends RowDataPacket {
    checkedForAvito: number | null;
    city_name: string | null;
    country_code: string | null;
    created_at: string | null;
    id: string | null;
    idPrimaryKey?: number;
    last_verification: string | null;
    password: string | null;
    port: number | null;
    proxy_address: string | null;
    proxyServer: Proxy | null;
    username: string | null;
    valid: number | null;
  }
  type Promotion = Array<{
    info: string;
    name: string;
  }>;
  export interface adsListEntitiy extends RowDataPacket {
    idAdsList: number;
    fkJobId: number;
    page: number;
    position: number;
    adsId: string;
    isPromoted: number;
    adsMainLink: string;
    adsPrice: string;
    description: string;
    promotion: Promotion;
    sellerName: string;
    sellerId: string;
    finishedAds: string;
    sellerReview: string;
    sellerRating: string;
    sellerBadge: string;
    title: string;
    underAuth: number;
  }
}
declare module 'resource-manage/lib/resource-manager-config' {
  export const confIpManager: {
    TIME_CHECK_FREEZE_RESOURCES: number;
    TIME_REALIZE_USED_RESOURCE: number;
    TIME_TO_WAIT_BETWEEN_USING: number;
  };
  export const configIpManagerForTest: {
    TIME_CHECK_FREEZE_RESOURCES: number;
    TIME_TO_WAIT_BETWEEN_USING: number;
    TIME_REALIZE_USED_RESOURCE: number;
  };
}
declare module 'resource-manage/lib/resource-manager' {
  import dayjs from 'dayjs';
  import { EventEmitter } from 'node:events';
  import { ILogger } from 'tslog-fork';
  export interface ProxyObject<T> {
    userData: T;
    uniqueKey: string;
    lastUse: dayjs.Dayjs;
    leasedTime: number;
    state: 'USING' | 'FREE';
    orderPos: number;
  }
  export class ResourceManager extends EventEmitter {
    log: ILogger;
    private proxyIpPool;
    constructor(log: ILogger);
    setproxyIpPool<T>(newPool: Array<ProxyObject<T>>): void;
    setTestConfig(): void;
    getResource<T>(leasedTimeParam?: number): Promise<ProxyObject<T>>;
    returnResource<T>(proxyObject: ProxyObject<T>): Promise<boolean>;
    returnResourceByKey(uniqueKey: string | number): Promise<boolean>;
    returnResourceByKeyNoAwait(uniqueKey: string | number): Promise<boolean>;
    printPool(): void;
    checkFreezeResources(job?: 'START' | 'STOP'): Promise<void>;
    printProxyPoolInfo(): {
      total: number;
      used: number;
      usedLong: number;
      free: number;
    };
  }
}
declare module 'helpers/mysql-helper' {
  import 'helpers/dotenv-init';
  import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
  export function destroyPool(): Promise<void>;
  export function retriableQuery<
    T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader,
  >(
    sql: string,
    values?:
      | any
      | any[]
      | {
          [param: string]: any;
        },
  ): Promise<[T, FieldPacket[]]>;
}
declare module 'resource-manage/proxy/proxy-db-init' {
  import { ProxyObject } from 'resource-manage/lib/resource-manager';
  import { Proxy } from 'resource-manage/types/Database';
  export function fillProxyPool(debug: boolean): Promise<ProxyObject<Proxy>[]>;
}
declare module 'resource-manage/index' {
  export { fillProxyPool } from 'resource-manage/proxy/proxy-db-init';
  export { ResourceManager } from 'resource-manage/lib/resource-manager';
  export type { ProxyObject } from 'resource-manage/lib/resource-manager';
  export { confIpManager } from 'resource-manage/lib/resource-manager-config';
}
declare module 'rmq-request-responce/types/types' {
  import { RMQ_serverQuery } from 'rmq-request-responce/server/server';
  import { Proxy } from 'resource-manage/types/Database';
  import { ProxyObject } from 'resource-manage/index';
  import { RMQ_proxyClientQuery } from 'rmq-request-responce/clients/clients';
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
  export type Worker<P extends Record<any, unknown>, R> = (
    this: RMQ_serverQuery,
    jobWorker: JobWorker<P, R>,
    type: string,
    msg: AMQPMessage,
  ) => Promise<void>;
  export type ClientHandler = (this: RMQ_proxyClientQuery, msg: AMQPMessage) => Promise<void>;
  export type JobWorker<P extends Record<any, unknown>, R> = (params: P) => Promise<R>;
}
declare module 'rmq-request-responce/clients/base-clients' {
  import { RMQ_construct_exchange } from 'rmq-request-responce/lib/base-req-res';
  import { ClientHandler } from 'rmq-request-responce/types/types';
  export class RMQ_clientQueryBase extends RMQ_construct_exchange {
    protected internalID: number;
    responceQueueName: string;
    constructor(exchange: string, queueInputName: string, routingKey: string);
    createRMQ_clientQueryBase(handleResponse: ClientHandler): Promise<void>;
    private initPrivateQueueForResponses;
  }
}
declare module 'config/config-rmq' {
  export const TIME_WAIT_PROXY_ANSWER = 15000;
  export const proxyRMQnames: {
    exchange: string;
    getproxy: string;
    returnProxy: string;
    printProxyQueue: string;
    refillProxy: string;
  };
}
declare module 'rmq-request-responce/clients/clients' {
  import { RMQ_clientQueryBase } from 'rmq-request-responce/clients/base-clients';
  export class RMQ_proxyClientQuery extends RMQ_clientQueryBase {
    protected registeredCallback: Map<number, (result?: unknown) => void>;
    private constructor();
    static createRMQ_clientQuery(
      exchange: string,
      queueInputName: string,
      routingKey: string,
    ): Promise<RMQ_proxyClientQuery>;
    private handleResponse;
    sendRequestAndResieveAnswer<Tquery_param = Record<string, any>, TreturnResult = unknown>(
      routingKey: string,
      params?: Tquery_param,
    ): Promise<TreturnResult>;
    sendRequestOnly<Tquery_param = Record<string, any>>(routingKey: string, params?: Tquery_param): Promise<void>;
  }
}
declare module 'rmq-request-responce/types/proxy-manager-interface' {
  interface Proxy {
    server: string;
    username: string;
    password: string;
  }
  export interface GetProxyClient {
    proxy: Proxy;
    uniqueKey: string;
  }
  export interface ErrType {
    err: string;
  }
  export interface IProxyManager {
    getProxy(leasedTime: number): Promise<GetProxyClient | ErrType>;
    returnProxy(uniqueKey: string): Promise<void>;
  }
}
declare module 'rmq-request-responce/clients/proxy-get' {
  import { ErrType, GetProxyClient, IProxyManager } from 'rmq-request-responce/types/proxy-manager-interface';
  export class ProxyGet implements IProxyManager {
    private instanceRMQ_proxyClientQuery;
    private instance;
    private constructor();
    static getInstance(): Promise<ProxyGet>;
    getProxy(leasedTime: number): Promise<GetProxyClient | ErrType>;
    returnProxy(uniqueKey: string): Promise<void>;
  }
}
declare module 'amqp-client-proxy-manager' {
  export { RMQ_proxyClientQuery } from 'rmq-request-responce/clients/clients';
  export { proxyRMQnames } from 'config/config-rmq';
  export { ProxyGet } from 'rmq-request-responce/clients/proxy-get';
  export type { GetProxyReturn, ParamGetProxy, ParamReturnProxy } from 'rmq-request-responce/types/types';
}
