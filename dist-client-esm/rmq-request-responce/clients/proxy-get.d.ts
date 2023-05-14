import { ErrType, GetProxyClient, IProxyManager } from '../types/proxy-manager-interface.js';
export declare class ProxyGet implements IProxyManager {
    private static instanceRMQ_proxyClientQuery;
    private static instance;
    private constructor();
    static getInstance(): Promise<ProxyGet>;
    getProxy(leasedTime: number): Promise<GetProxyClient | ErrType>;
    returnProxy(uniqueKey: string): Promise<void>;
}
export declare function getProxy(leasedTime?: number): Promise<GetProxyClient | ErrType>;
export declare function returnProxy(uniqueKey: string): Promise<void>;
