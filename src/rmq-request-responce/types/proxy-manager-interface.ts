interface Proxy {
  server: string;
  username: string;
  password: string;
}

export interface GetProxyClient {
  proxy: Proxy;
  uniqueKey: string;
}

export interface ErrType {
  err: string;
}

// данный интерфейс будет допускать разную имплементацию - как с помощью RMQ так и с помощью моего модуля

export interface IProxyManager {
  getProxy(leasedTime: number): Promise<GetProxyClient | ErrType>;

  /*
   * returnProxy(uniqueKey: string)
   * не ждет фактического возврата ресурса
   * ресур возвращается в работу через TIME_TO_WAIT_BETWEEN_USING после времени выдачи
   */
  returnProxy(uniqueKey: string): Promise<void>;

  /*
   * вызов функции ResourceManager printProxyPoolInfo();
   * печатает данные об общем наличии ресурса и количестве занятых ресурсов
   */
  // printProxyQueue(): Promise<void>;
  //
  // checkServerWorkPing(): Promise<boolean>;

  // export async function refillProxy() {}
}
