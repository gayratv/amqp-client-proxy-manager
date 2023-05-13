import { RMQ_construct_exchange } from '../lib/base-req-res.js';
import { JobWorker, Worker } from '../types/types.js';
import { AMQPQueue } from 'amqp-client-fork-gayrat';

/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_exchange {
  private constructor(exchange: string, queueInputName: string, routingKey: string) {
    super(exchange, queueInputName, routingKey);
  }

  /*
   * для каждого обработчика необходимо создать свою очередь, которую он будет прослушивать и брать оттуда задания
   */
  static async createRMQ_serverQuery<P extends Record<any, unknown>, R>(
    exchange: string,
    queueInputName: string,
    routingKey: string,
    worker: Worker<P, R>,
    jobWorker: JobWorker<P, R>,
  ) {
    const rserver = new RMQ_serverQuery(exchange, queueInputName, routingKey);
    await rserver.createRMQ_construct_exchange();

    // добавить первую очередь
    await rserver.addQueues(queueInputName, worker, jobWorker);

    return rserver;
  }

  private async consumeRequest<P extends Record<any, unknown>, R>(
    worker: Worker<P, R>,
    jobWorker: JobWorker<P, R>,
    type: string,
    q: AMQPQueue,
  ) {
    const workerBind = worker.bind(this, jobWorker, type);

    const consumer = await q.subscribe({ noAck: false }, workerBind);
  }

  /*
   * добавить дополнительную очередь к direct exchange
   * для каждого запроса создается своя очередь
   */
  async addQueues<P extends Record<any, unknown>, R>(
    queueName: string,
    worker: Worker<P, R>,
    jobWorker: JobWorker<P, R>,
  ) {
    const q = await this.channel.queue(queueName, { passive: false, durable: false, autoDelete: false });

    await this.channel.queueBind(queueName, this.exchange, queueName);

    await this.consumeRequest(worker, jobWorker, queueName, q);
  }
}
