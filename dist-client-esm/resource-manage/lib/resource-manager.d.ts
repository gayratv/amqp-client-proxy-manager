/// <reference types="node" resolution-mode="require"/>
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
export declare class ResourceManager extends EventEmitter {
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
