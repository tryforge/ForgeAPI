/// <reference types="node" />
import { IncomingMessage, Server, ServerResponse } from "node:http";
import { WebSocketServer } from "ws";
type _HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' | 'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK' | 'TRACE' | 'SEARCH';
export type HTTPMethods = Uppercase<_HTTPMethods> | Lowercase<_HTTPMethods>;
export type HandlerMethods = (request: IncomingMessage, reply: ServerResponse<IncomingMessage>) => void | Promise<void>;
export type wsHandler = (ws: WebSocket, request: IncomingMessage) => void | Promise<void>;
export interface RouteOptions {
    method: HTTPMethods | HTTPMethods[];
    url: string;
    handler: HandlerMethods;
    wsHandler?: wsHandler;
}
export declare class APICore {
    private data;
    static server: Server;
    static wss: WebSocketServer;
    constructor(port: number);
    load(dir: string): Promise<void>;
}
export {};
//# sourceMappingURL=core.d.ts.map