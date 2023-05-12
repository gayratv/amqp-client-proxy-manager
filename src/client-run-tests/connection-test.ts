import { RmqConnection } from '../rmq-request-responce/lib/rmq-connection.js';
import process from 'process';

const c = await RmqConnection.getInstance();
console.log('Finish ok');
// process.exit(0);
