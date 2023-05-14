export interface Proxy {
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
