import '../../helpers/dotenv-init.js';
import { AMQPClient, AMQPChannel } from 'amqp-client-fork-gayrat';
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
  public static connection: AMQPClient = null;
  public static channel: AMQPChannel = null;
  public static initializationState = 'start';
  public static initializationQueue: Array<unknown> = [];

  private constructor() {}

  /*
   * инициализирует connection + chanel
   */
  private static async RmqConnection(): Promise<void> {
    if (RmqConnection.connection) return; // connection установлен

    if (RmqConnection.initializationState === 'working') {
      return new Promise((resolve, reject) => {
        RmqConnection.initializationQueue.push(resolve);
      });
    }

    RmqConnection.initializationState = 'working';

    // const rmqConnection = new RmqConnection();
    const log = NLog.getInstance();
    log.info('Будет использован host rmq : ', process.env.RMQ_HOST);

    const amqp = new AMQPClient('amqp://' + process.env.RMQ_HOST);

    let error = false;
    let cntRetry = 0;
    do {
      try {
        error = false;
        RmqConnection.connection = (await amqp.connect()) as AMQPClient;
      } catch (e) {
        error = true;
        cntRetry++;
        log.warn('RMQ connection problem');
        await delay(3_000);
      }
    } while (error && cntRetry < 2);

    if (error) process.exit(105);

    RmqConnection.channel = await RmqConnection.connection.channel();

    /*
     * установить что выбирается только одно сообщение за раз
     * global: boolean – if the prefetch is limited to the channel, or if false to each consumer
     */

    RmqConnection.channel.basicQos(1, 0, false);
    RmqConnection.initializationQueue.forEach((calbackFn) => {
      log.debug('RmqConnection initialization done, calbackFn calles');
      // @ts-ignore
      calbackFn(null);
    });
  }

  static async getInstance() {
    if (!RmqConnection.connection) {
      await RmqConnection.RmqConnection();
    }
    // return RmqConnection.channel;
  }

  static async closeConnection() {
    if (!RmqConnection.connection) return;
    await RmqConnection.connection.close();
  }
}
