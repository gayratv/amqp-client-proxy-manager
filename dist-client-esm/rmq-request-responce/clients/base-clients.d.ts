import { RMQ_construct_exchange } from '../lib/base-req-res.js';
import { ClientHandler } from '../types/types.js';
export declare class RMQ_clientQueryBase extends RMQ_construct_exchange {
    protected internalID: number;
    responceQueueName: string;
    constructor(exchange: string, queueInputName: string, routingKey: string);
    createRMQ_clientQueryBase(handleResponse: ClientHandler): Promise<void>;
    private initPrivateQueueForResponses;
}
