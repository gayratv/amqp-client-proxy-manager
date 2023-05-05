import './dotenv-init.js';
import mysql from 'mysql2/promise';
import { delay } from './common.js';
import { NLog } from 'tslog-fork';
import { FieldPacket, OkPacket, QueryOptions, ResultSetHeader, RowDataPacket } from 'mysql2';

let pool: mysql.Pool;
const log = NLog.getInstance();

function createConnectionA() {
  if (!pool) {
    pool = mysql.createPool({
      port: parseInt(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      host: process.env.MYSQL_HOST,
      namedPlaceholders: true,
      // enableKeepAlive: true,
      // keepAliveInitialDelay: 1_000, // If keep-alive is enabled users can supply an initial delay.
    });
  }

  return pool;
}

export async function destroyPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function retriableQuery<
  T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader,
>(sql: string, values?: any | any[] | { [param: string]: any }): Promise<[T, FieldPacket[]]> {
  let retry = false;
  let retryCount = 0;
  let data;
  let delayTime = 100;
  do {
    retry = false;

    try {
      data = await pool.query(sql, values);
    } catch (err) {
      if ([4031, -4077, 1213].includes(err?.errno)) {
        // code: 'ECONNRESET', errno: -4077,
        // {"code":"ER_LOCK_DEADLOCK","errno":1213,
        retry = true;
        retryCount++;
        log.error(err.errno, err.code, ' retryCount ', retryCount);
        await delay(delayTime);
        delayTime = delayTime * 2;
      } else {
        log.error(err);
        throw err;
      }
    }
  } while (retry && retryCount < 5);
  if (retryCount >= 5) {
    throw new Error('MYSQL превышено максимальное количество retry :5');
  } else {
    // @ts-ignore
    return data;
  }
}

// создадим pool заранее
createConnectionA();
