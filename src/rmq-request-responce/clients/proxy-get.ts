import { RMQ_proxyClientQuery } from './clients.js';
import { proxyRMQnames, TIME_LEASED_PROXY_DEFAULT } from '../../config/config-rmq.js';
import { GetProxyReturn, ParamGetProxy, ParamReturnProxy } from '../types/types.js';
import { ErrType, GetProxyClient, IProxyManager } from '../types/proxy-manager-interface.js';

export class ProxyGet {
  // export class ProxyGet implements IProxyManager {
  static instanceRMQ_proxyClientQuery: RMQ_proxyClientQuery = null;
  // static instance: ProxyGet = null;

  // конструктор нельзя вызвать
  private constructor() {}

  static async getInstance() {
    if (ProxyGet.instanceRMQ_proxyClientQuery) return ProxyGet.instanceRMQ_proxyClientQuery;

    // const pget = new ProxyGet();
    // ProxyGet.instance = pget;

    const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(
      proxyRMQnames.exchange,
      proxyRMQnames.getproxy,
      proxyRMQnames.getproxy,
    );
    ProxyGet.instanceRMQ_proxyClientQuery = cli;

    return cli;
  }

  static async getProxy(leasedTime: number): Promise<GetProxyClient | ErrType> {
    const cli = await ProxyGet.getInstance();
    const res = await cli.sendRequestAndResieveAnswer<ParamGetProxy, GetProxyReturn>(proxyRMQnames.getproxy, {
      leasedTime,
    });
    return { proxy: res.userData.userData, uniqueKey: res.userData.uniqueKey };
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
  static async returnProxy(uniqueKey: string) {
    const cli = await ProxyGet.getInstance();
    cli.sendRequestOnly<ParamReturnProxy>(proxyRMQnames.returnProxy, {
      uniqueKey,
    });
  }
}

/*

имплементируем к клиентском коде

export async function getProxy(leasedTime = TIME_LEASED_PROXY_DEFAULT) {
  const inst = await ProxyGet.getInstance();
  return inst.getProxy(leasedTime);
}

export async function returnProxy(uniqueKey: string): Promise<void> {
  const inst = await ProxyGet.getInstance();
  return inst.returnProxy(uniqueKey);
}
*/
