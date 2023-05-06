import dayjs from 'dayjs';
import { EventEmitter } from 'node:events';
import { clearInterval } from 'node:timers';
import { ILogger } from 'tslog-fork';
import { configIpManagerForTest, confIpManager } from './resource-manager-config.js';

// идентификатор внутреннего события
const RESOURCE_REALIZE = 'realizeIP';

/*
 * ProxyObject представляет собой некоторый ресурс, который выдается менеджером
 * uniqueKey - внутренний уникальный ключ ресурса (приходит извне менеджера)
 * по этому ключу ресур освобождается
 * leasedTime - на какой максимальный срок (милисекунд) ресурс отдан в работу - если 0 - то ресурс принудельно не освобождается
 */
export interface ProxyObject<T> {
  userData: T;
  uniqueKey: string;

  lastUse: dayjs.Dayjs;
  leasedTime: number;
  state: 'USING' | 'FREE';
  orderPos: number;
}

export class ResourceManager extends EventEmitter {
  // хранит пул ресурсов
  private proxyIpPool: ProxyObject<any>[] = [];

  constructor(public log: ILogger) {
    super();
  }

  setproxyIpPool<T>(newPool: Array<ProxyObject<T>>) {
    this.proxyIpPool = newPool;
    // super.setMaxListeners(newPool.length + 3);
    // утилита рассчитана на работу в одном потоке с одним запросом поэтому слушателей может быть только 1
    super.setMaxListeners(2);
    this.checkFreezeResources('START');
  }

  setTestConfig() {
    type CMKeys = keyof typeof confIpManager;
    for (const configIpManagerKey in confIpManager) {
      confIpManager[configIpManagerKey as CMKeys] = configIpManagerForTest[configIpManagerKey as CMKeys];
    }
  }

  /*
   * ресурс разрешается запрашивать только по одному за один раз и обязательно через await
   * те нельзя накидать паралельных запросов getResource а потом ждать их завершения
   * этот модуль предназначен для работы совместо с библиотекой взаимодействия с сервером через socket
   * когда паралельные запросы складываются в очередь и очередь обрабатывается одним jober
   */
  async getResource<T>(leasedTimeParam = confIpManager.TIME_REALIZE_USED_RESOURCE): Promise<ProxyObject<T>> {
    // this.log.silly(this.log.sw('getIP start', 'green'));
    const now_ = dayjs();
    leasedTimeParam = leasedTimeParam < 0 ? confIpManager.TIME_REALIZE_USED_RESOURCE : leasedTimeParam;

    // leasedTime === 0 - неограниченное использование
    const freeIpPoll = this.proxyIpPool.filter((value) => {
      return (
        value.state === 'FREE' &&
        (!value.leasedTime || now_.diff(value.lastUse) > confIpManager.TIME_TO_WAIT_BETWEEN_USING)
      );
    });

    /*
   // debug
   const m1 = this.proxyIpPool.filter((value) => {
      return value.uniqueKey === '6';
    });
    const m2 = m1[0];
    console.log(m2);
    console.log('now_.diff(m2.lastUse) ', now_.diff(m2.lastUse), ' leasedTime ', m2.leasedTime);*/

    if (freeIpPoll.length > 0) {
      freeIpPoll.sort((a, b) => a.orderPos - b.orderPos); // более старые в конец

      const po = freeIpPoll[0];
      po.state = 'USING';
      po.lastUse = now_;
      po.orderPos++;
      po.leasedTime = leasedTimeParam;

      this.log.silly('выдан ресурс # ', po.uniqueKey);
      return po;
    }

    // ждем
    return new Promise((resolve, reject) => {
      this.log.silly('ожидаем освобождения ресурса');
      const eventEmiterListener = (message: ProxyObject<T>) => {
        this.log.silly('Emiter Message recieved: ', message.uniqueKey);
        const poolElement = this.proxyIpPool.find((element) => element.uniqueKey === message.uniqueKey);
        if (!poolElement) {
          this.log.error('Неверное сообщение о возврате ресурса');
          reject('Неверное сообщение о возврате ресурса');
          return;
        }
        if (poolElement.state === 'USING') {
          this.log.error('ресурс захвачен ранее');
          reject('ресурс захвачен ранее');
          return;
        }
        poolElement.lastUse = dayjs();
        poolElement.state = 'USING';
        poolElement.leasedTime = leasedTimeParam;
        this.log.silly('выдан ресурс # ', poolElement.uniqueKey);
        resolve(poolElement);
      };
      super.once(RESOURCE_REALIZE, eventEmiterListener);
      this.log.debug('всего слушателей : ', super.listenerCount(RESOURCE_REALIZE));
    });
  }

  async returnResource<T>(proxyObject: ProxyObject<T>) {
    return await this.returnResourceByKey(proxyObject.uniqueKey);
  }

  /*
   * returnResourceByKey
   * клиент сообщает о возврате ресурса
   * но фактически ресурс может перейти в статус "свободно" только тогда когда истечет интервал между использованием ресурса
   */
  async returnResourceByKey(uniqueKey: string | number): Promise<boolean> {
    if (typeof uniqueKey === 'number') uniqueKey = uniqueKey.toString();
    const ip = this.proxyIpPool.find((value) => value.uniqueKey === uniqueKey);
    if (!ip) return false;

    const now_ = dayjs();
    const diffMS = now_.diff(ip.lastUse);

    const markResourceFree = () => {
      ip.state = 'FREE';
      this.log.warn('ресурс освобожден uniqueKey: ', uniqueKey);
      super.emit(RESOURCE_REALIZE, ip); //  сообщаем об освобождении ресурса
    };

    if (diffMS < confIpManager.TIME_TO_WAIT_BETWEEN_USING) {
      return new Promise((resolve) => {
        setTimeout(() => {
          markResourceFree();
          resolve(true);
        }, confIpManager.TIME_TO_WAIT_BETWEEN_USING - diffMS);
      });
    } else {
      markResourceFree();
      return true;
    }
  }

  /*
   * returnResourceByKey
   * клиент сообщает о возврате ресурса
   * но фактически ресурс может перейти в статус "свободно" только тогда когда истечет интервал между использованием ресурса
   */
  returnResourceByKeyNoAwait(uniqueKey: string | number): Promise<boolean> {
    if (typeof uniqueKey === 'number') uniqueKey = uniqueKey.toString();
    const ip = this.proxyIpPool.find((value) => value.uniqueKey === uniqueKey);
    if (!ip) return;

    const now_ = dayjs();
    const diffMS = now_.diff(ip.lastUse);

    const markResourceFree = () => {
      ip.state = 'FREE';
      this.log.warn('ресурс освобожден uniqueKey: ', uniqueKey);
      super.emit(RESOURCE_REALIZE, ip); //  сообщаем об освобождении ресурса
    };

    if (diffMS < confIpManager.TIME_TO_WAIT_BETWEEN_USING) {
      // подождать завершения установленного интервала
      setTimeout(() => {
        markResourceFree();
      }, confIpManager.TIME_TO_WAIT_BETWEEN_USING - diffMS);

      return;
    } else {
      markResourceFree();
      return;
    }
  }

  printPool() {
    this.log.info(this.log.sw('Содержимое пула', ['bold', 'blue']));
    this.proxyIpPool.forEach((p) => {
      this.log.silly('   ', p.uniqueKey, p.state, p.orderPos);
    });
  }

  /*
   * checkHungIp возвращает в работу "зависшие" IP - на которую клиент не вызвал returnIP
   */
  async checkFreezeResources(job: 'START' | 'STOP' = 'START') {
    let timeHandler;
    switch (job) {
      case 'START':
        if (timeHandler) return;
        timeHandler = setInterval(async () => {
          const now_ = dayjs();
          const delayIpPoll = this.proxyIpPool.filter((value) => {
            return value.state === 'USING' && value.leasedTime > 0 && now_.diff(value.lastUse) > value.leasedTime;
          });
          // delayIpPoll.length && this.log.trace('будет освобождено ресурсов ', delayIpPoll.length);
          this.log.trace('будет освобождено ресурсов ', delayIpPoll.length);

          for (const proxyObject of delayIpPoll) {
            await this.returnResource(proxyObject);
          }
        }, confIpManager.TIME_CHECK_FREEZE_RESOURCES);
        break;
      case 'STOP':
        timeHandler && clearInterval(timeHandler);
        timeHandler = null;
        break;
    }
  }

  /*
   * printProxyPoolInfo печатает текущее состояние пула ресурсов
   */
  printProxyPoolInfo(): { total: number; used: number; usedLong: number; free: number } {
    this.log.debug(this.log.sw('-------- printProxyPoolInfo ---------------', ['blue', 'bgMagentaBright']));
    const used = this.proxyIpPool.filter((val) => val.state === 'USING' && val.leasedTime !== 0).length;
    const usedLong = this.proxyIpPool.filter((val) => val.state === 'USING' && val.leasedTime === 0).length;
    const free = this.proxyIpPool.length - used - usedLong;
    const total = this.proxyIpPool.length;
    this.log.debug(`всего proxy:${total} занято : ${used} занято бессрочно: ${usedLong} свободно : ${free}`);
    return { total, used, usedLong, free };
  }
}
