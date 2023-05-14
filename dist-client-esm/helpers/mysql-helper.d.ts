import './dotenv-init.js';
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
export declare function destroyPool(): Promise<void>;
export declare function retriableQuery<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(sql: string, values?: any | any[] | {
    [param: string]: any;
}): Promise<[T, FieldPacket[]]>;
