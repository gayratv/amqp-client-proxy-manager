export const confIpManager = {
  TIME_CHECK_FREEZE_RESOURCES: 10_000, // время запуска таймера который собирает забытые IP

  TIME_REALIZE_USED_RESOURCE: 6_000, // сколько ждать перед запуском IP в работу с момента последнего использования должно пройти больше времени чем указано тут этот параметр применяется для "зависших" proxy (checkHungIp)

  TIME_TO_WAIT_BETWEEN_USING: 3_000, // сколько ждать от одного использования до другого
};

export const configIpManagerForTest = {
  TIME_CHECK_FREEZE_RESOURCES: 10_000, // время запуска таймера который собирает забытые IP
  TIME_TO_WAIT_BETWEEN_USING: 5_000, // сколько ждать от одного использования до другого
  TIME_REALIZE_USED_RESOURCE: 10_000, // сколько ждать перед запуском IP в работу
};
