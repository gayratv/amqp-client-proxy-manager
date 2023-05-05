import { RMQ_construct_queues } from '../lib/base-req-res.js';
import { JobWorker, Worker } from '../types/types.js';

/*
 * принимает запрос по queue и отправляет ответ в очередь, указанную в msg
 */
export class RMQ_serverQuery extends RMQ_construct_queues {
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
    await rserver.createRMQ_construct_queues();

    // добавить первую очередь
    await rserver.addQueues(queueInputName, worker, jobWorker);

    return rserver;
  }

  private async consumeRequest<P extends Record<any, unknown>, R>(worker: Worker<P, R>, jobWorker: JobWorker<P, R>) {
    const workerBind = worker.bind(this, jobWorker);
    // клиенты будут получать по одному сообщению за один раз
    await this.channel.prefetch(1, false); // Per consumer limit

    await this.channel.consume(this.queueInputName, workerBind, { noAck: false });
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
    await this.channel.assertQueue(queueName, { durable: false });
    await this.channel.bindQueue(queueName, this.exchange, queueName);
    await this.consumeRequest(worker, jobWorker);
  }
}
