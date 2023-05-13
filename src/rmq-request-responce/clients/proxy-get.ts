import { RMQ_proxyClientQuery } from './clients.js';
import { proxyRMQnames } from '../../config/config-rmq.js';
import { GetProxyReturn, ParamGetProxy, ParamReturnProxy } from '../types/types.js';

export class ProxyGet {
  private instanceRMQ_proxyClientQuery: RMQ_proxyClientQuery;
  private instance: ProxyGet;
  private constructor() {}
  static async getInstance() {
    const pget = new ProxyGet();
    pget.instance = pget;

    const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(
      proxyRMQnames.exchange,
      proxyRMQnames.getproxy,
      proxyRMQnames.getproxy,
    );
    pget.instanceRMQ_proxyClientQuery = cli;

    return pget;
  }

  async getProxy(leasedTime: number) {
    return await this.instanceRMQ_proxyClientQuery.sendRequestAndResieveAnswer<ParamGetProxy, GetProxyReturn>(
      proxyRMQnames.getproxy,
      {
        leasedTime,
      },
    );
  }
  /*
пример ответа
p1.userData.uniqueKey

{ userData:
   { userData:
      { server: 'http://104.239.80.193:5771', password: '[***]', username: 'wmdzslaf' },
     uniqueKey: '6',
     lastUse: '2023-05-13T18:36:07.796Z',
     state: 'USING',
     orderPos: 4,
     leasedTime: 3000
     }
   }

 */

  /*
    возврат в код происходит почти мгновенно
   */
  async returnProxy(p1: GetProxyReturn) {
    this.instanceRMQ_proxyClientQuery.sendRequestOnly<ParamReturnProxy>(proxyRMQnames.returnProxy, {
      uniqueKey: p1.userData.uniqueKey,
    });
  }
}
