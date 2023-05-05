# resource-manage 
### это отдельный изолированный модуль для выдачи свободных proxy

В самом верху не забудь установить DEBUG в false

сервер принимает запросы:

**ping** - служит для проверки сервер живой или нет

рекомендуется везде использовать только 
requestServer - он посылает запрос и ждет ответа

**getProxy**

const res = await s.requestServer('getProxy');

await s.sendMsg(JSON.stringify({ type: 'getProxy', queryIndex: counter++ }));


**returnProxy**

await s.requestServer('returnProxy', 6);

Вариант без ожидания ответа от сервера.
Возврат ресурса осуществляется после истечения времени TIME_TO_WAIT_BETWEEN_USING
```
const m: MessageToServer = { type: 'returnProxy', queryIndex: 0, payload: 6 };
await s.sendMsg(JSON.stringify(m));
```


**printProxyQueue**
печатает информацию о текущем пуле proxy
