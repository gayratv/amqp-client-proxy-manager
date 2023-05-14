import '../../helpers/dotenv-init.js';
import { AMQPClient } from 'amqp-client-fork-gayrat';
// import { AMQPClient, AMQPChannel } from '@cloudamqp/amqp-client';
import { NLog } from 'tslog-fork';
import { delay } from '../../helpers/common.js';
import process from 'process';
// import {AMQPBaseClient} from "@cloudamqp/amqp-client/src/amqp-base-client.js";
/*
 returns singleton contains RMQ connection and chanel
 RMQ describe that need only one connection and one chanel for one thread
 because node is 1 thread app we need only one chanel
 */
export class RmqConnection {
    connection;
    channel;
    static instance;
    constructor() { }
    /*
     * инициализирует connection + chanel
     */
    static async RmqConnection() {
        const rmqConnection = new RmqConnection();
        const log = NLog.getInstance();
        log.info('Будет использован host rmq : ', process.env.RMQ_HOST);
        const amqp = new AMQPClient('amqp://' + process.env.RMQ_HOST);
        let error = false;
        let cntRetry = 0;
        do {
            try {
                error = false;
                rmqConnection.connection = (await amqp.connect());
            }
            catch (e) {
                error = true;
                cntRetry++;
                log.warn('RMQ connection problem');
                await delay(3_000);
            }
        } while (error && cntRetry < 2);
        if (error)
            process.exit(105);
        rmqConnection.channel = await rmqConnection.connection.channel();
        /*
         * установить что выбирается только одно сообщение за раз
         * global: boolean – if the prefetch is limited to the channel, or if false to each consumer
         */
        rmqConnection.channel.basicQos(1, 0, false);
        return rmqConnection;
    }
    static async getInstance() {
        if (!RmqConnection.instance) {
            RmqConnection.instance = await RmqConnection.RmqConnection();
        }
        return RmqConnection.instance;
    }
    async closeConnection() {
        if (!RmqConnection.instance)
            return;
        await this.connection.close();
    }
}
//# sourceMappingURL=rmq-connection.js.map