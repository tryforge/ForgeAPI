import { type ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { ForgeAPICommandManager } from "../managers/ForgeAPICommandManager";
import { BackendServer, IForgeAPISetupOptions } from "./BackendServer";
import { ForgeAPIRouteOptions } from "./ForgeAPIRoute";
/**
 * API integration for your ForgeScript client.
 */
export declare class ForgeAPI extends ForgeExtension {
    #private;
    private options;
    name: string;
    description: string;
    version: string;
    constructor(options: IForgeAPISetupOptions);
    /**
     * Add event commands to ForgeAPI.
     * @param events - The events to be added.
     * @returns {ForgeAPI}
     */
    addEvents(...events: Parameters<ForgeAPICommandManager['add']>): this;
    /**
     * Add routes to ForgeAPI.
     * @param routes - The routes to be added.
     * @returns {ForgeAPI}
     */
    addRoutes(...routes: ForgeAPIRouteOptions[]): this;
    /**
     * Starts the ForgeAPI extension.
     * @param client - The ForgeClient instance to attach the extension to.
     * @returns {void}
     */
    init(client: ForgeClient): void;
    /**
     * Check whether the given request is authed.
     * @param req
     * @returns {boolean}
     */
    private isAuthed;
    /**
     * Check the IP in the incoming request to match with any
     * of the provided ID's in the ForgeAPI constructor.
     * @param req - Express request object.
     * @returns {boolean}
     */
    private validIP;
    /**
     * Normalizes the given IP address.
     * @param ip - The address to be normalized.
     * @returns {string}
     */
    private normalizeIp;
    private checkCode;
    /**
     * Generates a bearer token.
     */
    private generateBearer;
    /**
     * Verifies the bearer token with "jwt".
     */
    private checkBearer;
    /**
     * Returns the ForgeAPICommandManager instance.
     */
    get commands(): ForgeAPICommandManager;
    /**
     * Returns the backend of the ForgeAPI.
     */
    get server(): BackendServer;
    /**
     * Returns the ForgeAPIRouteManager instance.
     */
    get routes(): import("../..").ForgeAPIRouteManager;
    /**
     * Returns the websocket server of the ForgeAPI backend.
     */
    get ws(): this['server']['app']['ws'];
}
//# sourceMappingURL=ForgeAPI.d.ts.map