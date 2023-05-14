import { RMQ_clientQueryBase } from './base-clients.js';
export declare class RMQ_proxyClientQuery extends RMQ_clientQueryBase {
    protected registeredCallback: Map<number, (result?: unknown) => void>;
    private constructor();
    static createRMQ_clientQuery(exchange: string, queueInputName: string, routingKey: string): Promise<RMQ_proxyClientQuery>;
    private handleResponse;
    sendRequestAndResieveAnswer<Tquery_param = Record<string, any>, TreturnResult = unknown>(routingKey: string, params?: Tquery_param): Promise<TreturnResult>;
    sendRequestOnly<Tquery_param = Record<string, any>>(routingKey: string, params?: Tquery_param): Promise<void>;
}
