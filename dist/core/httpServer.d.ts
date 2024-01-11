/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "node:http";
type _HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' | 'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK' | 'TRACE' | 'SEARCH';
export type HTTPMethods = Uppercase<_HTTPMethods> | Lowercase<_HTTPMethods>;
export type HandlerMethods = (request: IncomingMessage, reply: ServerResponse<IncomingMessage>) => ServerResponse;
export interface RouteOptions {
    method: HTTPMethods | HTTPMethods[];
    url: string;
    handler: HandlerMethods;
}
export declare class httpServer {
    private data;
    constructor(port: number);
    load(dir: string): Promise<void>;
}
export {};
//# sourceMappingURL=httpServer.d.ts.map