import { ForgeClient } from "@tryforge/forgescript";
import { IncomingMessage, ServerResponse } from "http";
type _HTTPMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' | 'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK' | 'TRACE' | 'SEARCH';
export type HTTPMethods = Uppercase<_HTTPMethods> | Lowercase<_HTTPMethods>;
export type HandlerContext = (ctx: {
    client: ForgeClient;
    request: IncomingMessage;
    reply: ServerResponse<IncomingMessage>;
}) => void | Promise<void>;
export type wsContext = (ctx: {
    client: ForgeClient;
    ws: WebSocket;
    request: IncomingMessage;
}) => void | Promise<void>;
export {};
//# sourceMappingURL=types.d.ts.map