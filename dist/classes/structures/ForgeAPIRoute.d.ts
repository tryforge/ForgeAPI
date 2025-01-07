import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import type { ForgeClient, ICompiledCommand } from "@tryforge/forgescript";
import type { IncomingMessage } from "http";
/**
 * All possible HTTP methods.
 */
export type RawHTTPMethods = "get" | "put" | "post" | "delete" | "patch" | "options" | "trace" | "connect";
/**
 * All possible HTTP methods ignoring case.
 */
export type HTTPMethods = RawHTTPMethods | Uppercase<RawHTTPMethods>;
/**
 * The base context object for routes/websocket entries.
 */
interface BaseContext {
    client: ForgeClient;
}
/**
 * The context of an API route.
 */
export interface RouteContext extends BaseContext {
    req: ExpressRequest;
    res: ExpressResponse;
}
/**
 * The context of a websocket request.
 */
export interface WebSocketContext extends BaseContext {
    ws: WebSocket;
    req: IncomingMessage;
}
/**
 * The executor for each route.
 */
export type RouteHandlerExecutor = (ctx: RouteContext) => Promise<void> | void;
/**
 * The executor for each websocket entry.
 */
export type WebSocketHandlerExecutor = (ctx: WebSocketContext) => Promise<void> | void;
/**
 * A ForgeAPI route handler.
 */
export interface ForgeAPIRouteOptions {
    url: string;
    method: HTTPMethods;
    auth?: boolean;
    handler: string | RouteHandlerExecutor;
    compiled?: ICompiledCommand;
    [key: string]: unknown;
}
/**
 * A ForgeAPI websocket handler.
 */
export interface ForgeAPIWebSocketOptions {
    url?: string;
    auth?: boolean;
    handler: string | WebSocketHandlerExecutor;
    compiled?: ICompiledCommand;
    [key: string]: unknown;
}
export {};
//# sourceMappingURL=ForgeAPIRoute.d.ts.map