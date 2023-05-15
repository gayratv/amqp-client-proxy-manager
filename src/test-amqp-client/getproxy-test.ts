import { ProxyGet } from '../rmq-request-responce/clients/proxy-get.js';

const TIME_LEASED_PROXY_DEFAULT = 3_000;

async function getProxy(leasedTime = TIME_LEASED_PROXY_DEFAULT) {
  return await ProxyGet.getProxy(leasedTime);
}

async function returnProxy(uniqueKey: string): Promise<void> {
  return await ProxyGet.returnProxy(uniqueKey);
}

async function main() {
  const promiseA = [];
  // await ProxyGet.getInstance();
  for (let i = 0; i < 4; i++) {
    const proxy = getProxy();
    promiseA.push(proxy);
  }
  await Promise.all(promiseA).then((values) => {
    console.log(values);
  });
}

await main();
console.log('************ FINISH');
