import { ForgeClient } from "@tryforge/forgescript";
import { Request, Response } from "express";
import { app } from "@tryforge/webserver";
import { IncomingMessage } from "http";
export declare enum AuthType {
    None = 0,
    Min = 1,
    Full = 2
}
export type auth = {
    type: AuthType;
    ip?: string | string[];
    code?: string | string[];
    bearer?: boolean;
};
export interface IRouteManagerOptions {
    port: number;
    client: ForgeClient;
    auth?: auth;
}
type RawHTTPMethods = "get" | "put" | "post" | "delete" | "patch" | "options" | "trace" | "connect";
type HTTPMethods = Uppercase<RawHTTPMethods> | RawHTTPMethods;
export type RouteOptions = {
    url: string;
    method: HTTPMethods | HTTPMethods[];
    auth?: boolean;
    handler: (ctx: {
        client: ForgeClient;
        req: Request;
        res: Response;
    }) => Promise<void> | void;
};
export type WsOptions = {
    url?: string;
    auth?: boolean;
    handler: (ctx: {
        client: ForgeClient;
        ws: WebSocket;
        req: IncomingMessage;
    }) => Promise<void> | void;
};
export declare class RouteManager {
    private config;
    app: ReturnType<typeof app>;
    constructor(config: IRouteManagerOptions);
    load(dir: string): void;
    route(options: RouteOptions): void;
    private isAuthed;
    private generateBearer;
    private checkCode;
    private checkBearer;
}
export {};
//# sourceMappingURL=manager.d.ts.map