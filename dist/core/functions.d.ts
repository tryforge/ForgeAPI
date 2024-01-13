import { IncomingMessage, ServerResponse } from "http";
import { RouteOptions } from ".";
export declare const isValidFile: (file: string) => boolean;
export declare const httpReply: (request: IncomingMessage, reply: ServerResponse, data: RouteOptions[]) => void | Promise<void>;
export declare const wsReply: (ws: WebSocket, request: IncomingMessage, data: RouteOptions[]) => void | Promise<void>;
//# sourceMappingURL=functions.d.ts.map