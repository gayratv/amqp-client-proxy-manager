import { NLog } from 'tslog-fork';
import { RmqConnection } from './rmq-connection.js';
/*
 * порядок использования
 * const a=new RMQ_construct_queues(....);
 * await a.createRMQ_construct_queues()
 */
export class RMQ_construct_exchange {
    exchange;
    queueInputName;
    routingKey;
    log = NLog.getInstance();
    connection;
    channel;
    constructor(exchange, queueInputName, routingKey) {
        this.exchange = exchange;
        this.queueInputName = queueInputName;
        this.routingKey = routingKey;
    }
    /*
     * инициализирует exchange типа direct
     */
    async createRMQ_construct_exchange() {
        const rcon = await RmqConnection.getInstance();
        this.connection = rcon.connection;
        this.channel = rcon.channel;
        await rcon.channel.exchangeDeclare(this.exchange, 'direct', { durable: false });
    }
}
//# sourceMappingURL=base-req-res.js.map