import { ProxyObject } from '../lib/resource-manager.js';
import { Proxy } from '../types/Database.js';
export declare function fillProxyPool(debug: boolean): Promise<ProxyObject<Proxy>[]>;
