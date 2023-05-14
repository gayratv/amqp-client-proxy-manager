import { RMQ_construct_exchange } from '../lib/base-req-res.js';
import { JobWorker, Worker } from '../types/types.js';
export declare class RMQ_serverQuery extends RMQ_construct_exchange {
    private constructor();
    static createRMQ_serverQuery<P extends Record<any, unknown>, R>(exchange: string, queueInputName: string, routingKey: string, worker: Worker<P, R>, jobWorker: JobWorker<P, R>): Promise<RMQ_serverQuery>;
    private consumeRequest;
    addQueues<P extends Record<any, unknown>, R>(queueName: string, worker: Worker<P, R>, jobWorker: JobWorker<P, R>): Promise<void>;
}
