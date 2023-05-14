import { RowDataPacket } from 'mysql2';
export interface customer_queryEntity extends RowDataPacket {
    /** id заказчика - UUID V4 */
    fkCustomer: string;
    /** этот профиль будет использоваться для сканирования запроса */
    fkUserProfile: number;
    idСustomerQuery?: number;
    /** комментарий пользователя */
    name: string;
    url: string;
}
export interface customersEntity {
    /** коментарии  */
    description: string | null;
    /** id заказчика - UUID V4 */
    idCustomer: string;
    /** наименование Закачика */
    name: string;
    timestamp?: Date;
}
export interface adsOneAdEntity {
    author: string | null;
    authorId: string | null;
    datePublish: string | null;
    fkQueryExecutions: string;
    idAd: string | null;
    idOneAd?: string;
    sellerRating: string | null;
    sellerRewievs: string | null;
    timestamp?: Date;
    title: string | null;
    todayView: string | null;
    totalView: string | null;
}
export interface adsJobsEntity {
    idJob: number;
    fkCustomerQuery: number;
    cntPagesInQuery?: number;
    timestamp?: Date;
}
export interface Proxy {
    server: string;
    username: string;
    password: string;
}
export interface BaseSite {
    baseSite: Array<string>;
}
export interface Cookies {
    name: string;
    path: string;
    value: string;
    domain: string;
    secure: boolean;
    expires: number;
    httpOnly: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
}
interface Origin {
    origin: string;
    localStorage: Array<{
        name: string;
        value: string;
    }>;
}
export type CookiesList = {
    cookies: Cookies[];
    origins: Origin[];
};
export interface user_profilesEntity extends RowDataPacket {
    idUser: number;
    /** основной сайт на который надо переходить обновлять куки это массив сайтов - надо будет прохоить по ним всем  */
    baseSite?: BaseSite;
    cookies?: CookiesList;
    /** коментарии профиля */
    description?: string;
    fingerprint?: any;
    /** id заказчика - UUID V4 */
    idCustomer?: string;
    /** наименование профиля */
    name?: string;
    timestamp?: Date;
    proxyServer?: Proxy;
}
export interface proxyListEntity extends RowDataPacket {
    /** для какого профиля назначен этот proxy */
    assignedToProfile: number | null;
    idProxyList: number;
    /** какой сервер предотсавляет proxy */
    proxyProvider?: string;
    proxyServer: any;
    proxyServerBlocked: number;
    timestamp: Date;
    /** исходная строка webshare */
    webshareSrcString: string | null;
    comments: string | null;
    checkedForAvito: number | null;
}
export interface webShareProxyListApiEntity extends RowDataPacket {
    checkedForAvito: number | null;
    city_name: string | null;
    country_code: string | null;
    created_at: string | null;
    id: string | null;
    idPrimaryKey?: number;
    last_verification: string | null;
    password: string | null;
    port: number | null;
    proxy_address: string | null;
    proxyServer: Proxy | null;
    username: string | null;
    valid: number | null;
}
type Promotion = Array<{
    info: string;
    name: string;
}>;
export interface adsListEntitiy extends RowDataPacket {
    idAdsList: number;
    fkJobId: number;
    page: number;
    position: number;
    adsId: string;
    isPromoted: number;
    adsMainLink: string;
    adsPrice: string;
    description: string;
    promotion: Promotion;
    sellerName: string;
    sellerId: string;
    finishedAds: string;
    sellerReview: string;
    sellerRating: string;
    sellerBadge: string;
    title: string;
    underAuth: number;
}
export {};
