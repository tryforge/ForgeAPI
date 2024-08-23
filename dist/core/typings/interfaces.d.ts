import { HTTPMethods, HandlerContext, wsContext } from ".";
export interface RouteOptions {
    method: HTTPMethods | HTTPMethods[];
    auth?: boolean;
    url: string;
    handler: HandlerContext;
    wsHandler?: wsContext;
}
export interface IForgeAPIOptions {
    port: number;
    load?: string;
    authorization?: string | string[];
    authType?: 'authorization' | 'ip' | 'custom';
    debug?: boolean;
}
//# sourceMappingURL=interfaces.d.ts.map