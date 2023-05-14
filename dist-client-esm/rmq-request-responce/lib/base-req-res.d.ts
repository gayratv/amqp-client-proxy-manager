import { NLog } from 'tslog-fork';
import { AMQPChannel, AMQPClient } from 'amqp-client-fork-gayrat';
export declare class RMQ_construct_exchange {
    exchange: string;
    queueInputName: string;
    routingKey: string;
    log: NLog;
    connection: AMQPClient;
    channel: AMQPChannel;
    constructor(exchange: string, queueInputName: string, routingKey: string);
    createRMQ_construct_exchange(): Promise<void>;
}
