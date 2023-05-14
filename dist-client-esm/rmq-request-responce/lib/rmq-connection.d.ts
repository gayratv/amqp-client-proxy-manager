import '../../helpers/dotenv-init.js';
import { AMQPClient, AMQPChannel } from 'amqp-client-fork-gayrat';
export declare class RmqConnection {
    connection: AMQPClient;
    channel: AMQPChannel;
    private static instance;
    private constructor();
    private static RmqConnection;
    static getInstance(): Promise<RmqConnection>;
    closeConnection(): Promise<void>;
}
