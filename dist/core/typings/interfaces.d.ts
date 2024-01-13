import { HTTPMethods, HandlerContext, wsContext } from ".";
export interface RouteOptions {
    method: HTTPMethods | HTTPMethods[];
    url: string;
    handler: HandlerContext;
    wsHandler?: wsContext;
}
export interface IForgeAPIOptions {
    port: number;
    load?: string;
}
//# sourceMappingURL=interfaces.d.ts.map