import { RMQ_construct_exchange } from '../lib/base-req-res.js';
/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_exchange {
    constructor(exchange, queueInputName, routingKey) {
        super(exchange, queueInputName, routingKey);
    }
    /*
     * для каждого обработчика необходимо создать свою очередь, которую он будет прослушивать и брать оттуда задания
     */
    static async createRMQ_serverQuery(exchange, queueInputName, routingKey, worker, jobWorker) {
        const rserver = new RMQ_serverQuery(exchange, queueInputName, routingKey);
        await rserver.createRMQ_construct_exchange();
        // добавить первую очередь
        await rserver.addQueues(queueInputName, worker, jobWorker);
        return rserver;
    }
    async consumeRequest(worker, jobWorker, type, q) {
        const workerBind = worker.bind(this, jobWorker, type);
        const consumer = await q.subscribe({ noAck: false }, workerBind);
    }
    /*
     * добавить дополнительную очередь к direct exchange
     * для каждого запроса создается своя очередь
     */
    async addQueues(queueName, worker, jobWorker) {
        const q = await this.channel.queue(queueName, { passive: false, durable: false, autoDelete: false });
        await this.channel.queueBind(queueName, this.exchange, queueName);
        await this.consumeRequest(worker, jobWorker, queueName, q);
    }
}
//# sourceMappingURL=server.js.map