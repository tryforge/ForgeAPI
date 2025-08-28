/// <reference types="node" />
import { ForgeAPIWebsocketManager } from "../managers/ForgeAPIWebsocketManager";
import { ForgeAPICommandManager } from "../managers/ForgeAPICommandManager";
import { ForgeAPIRouteManager } from "../managers/ForgeAPIRouteManager";
import { LogPriority, type ForgeClient } from "@tryforge/forgescript";
import type { Express, Request, Response } from "express";
import { EventEmitter } from "events";
/**
 * The events the server can emit.
 */
export interface BackendServerEvents {
    /**
     * Emitted when something goes wrong.
     */
    error: [err: Error];
    /**
     * Emitted when a request is made.
     */
    request: [req: Request, res: Response];
    /**
     * Emitted when the backend server is ready.
     */
    ready: [];
}
/**
 * The available auth types.
 */
export declare enum AuthType {
    None = 0,
    Min = 1,
    Full = 2
}
/**
 * Authentication options for the API.
 */
export interface IAuthOptions {
    type: AuthType;
    ip?: string | string[];
    code?: string | string[];
    bearer?: boolean;
}
/**
 * The setup options for the API.
 */
export interface IForgeAPISetupOptions {
    /**
     * The API authorization options.
     * @example
     * auth: {
     *      type: AuthType.None,
     *      code: 'myawesomecode',
     *      bearer: true
     * }
     */
    auth?: IAuthOptions;
    /**
     * The events the backend server should listen to.
     * @example
     * events: ['request', 'error', 'ready']
     */
    events?: keyof BackendServer[];
    /**
     * Logger level priority.
     * @example
     * logLevel: LogPriority.Medium
     */
    logLevel?: LogPriority;
    /**
     * The port your api must listen to.
     * @example
     * port: 5000
     */
    port: number;
}
/**
 * Your API server.
 */
export declare class BackendServer extends EventEmitter<BackendServerEvents> {
    #private;
    private options;
    constructor(options: IForgeAPISetupOptions);
    /**
     * Starts the ForgeAPI backend server.
     * @param client - The ForgeClient instance.
     * @returns {void}
     */
    init(client: ForgeClient): void;
    /**
     * Returns the express instance of the server.
     */
    get app(): Express;
    /**
     * Returns the event command manager.
     */
    get commands(): ForgeAPICommandManager;
    /**
     * Returns the route manager.
     */
    get routes(): ForgeAPIRouteManager;
    /**
     * Returns the websocket route manager.
     */
    get websocketRoutes(): ForgeAPIWebsocketManager;
}
//# sourceMappingURL=BackendServer.d.ts.map