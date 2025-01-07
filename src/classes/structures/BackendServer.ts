import { ForgeAPICommandManager } from "../managers/ForgeAPICommandManager"
import { ForgeAPIRouteManager } from "../managers/ForgeAPIRouteManager"
import { LogPriority, type ForgeClient } from "@tryforge/forgescript"
import type { Express, Request, Response } from "express"
import { InternalLogger } from "./InternalLogger"
import { app } from "@tryforge/webserver"
import { EventEmitter } from "events"

/**
 * The events the server can emit.
 */
export interface BackendServerEvents {
    /**
     * Emitted when something goes wrong.
     */
    error: [err: Error]
    /**
     * Emitted when a request is made.
     */
    request: [req: Request, res: Response]
    /**
     * Emitted when the backend server is ready.
     */
    ready: []
}

/**
 * The available auth types.
 */
export enum AuthType {
    None,
    Min,
    Full
}

/**
 * Authentication options for the API.
 */
export interface IAuthOptions {
    type: AuthType
    ip?: string | string[]
    code?: string | string[]
    bearer?: boolean
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
    auth?: IAuthOptions
    /**
     * The events the backend server should listen to.
     * @example
     * events: ['request', 'error', 'ready']
     */
    events?: keyof BackendServer[]
    /**
     * Logger level priority.
     * @example
     * logLevel: LogPriority.Medium
     */
    logLevel?: LogPriority
    /**
     * The port your api must listen to.
     * @example
     * port: 5000
     */
    port: number
}

/**
 * Your API server.
 */
export class BackendServer extends EventEmitter<BackendServerEvents> {
    #app: Express
    #commands: ForgeAPICommandManager | null = null
    #client: ForgeClient | null = null
    #routes: ForgeAPIRouteManager = new ForgeAPIRouteManager()
    constructor(private options: IForgeAPISetupOptions) {
        super()
        this.#app = app(options.port)
    }

    /**
     * Starts the ForgeAPI backend server.
     * @param client - The ForgeClient instance.
     * @returns {void}
     */
    public init(client: ForgeClient) {
        this.#client = client
        this.#commands = new ForgeAPICommandManager(client)

        if (this.options.auth?.bearer) {
            InternalLogger.info(`Your Bearer Token: ${this}`)
        }

        InternalLogger.debug(`${this.constructor.name} initialized.`)
    }

    /**
     * Returns the express instance of the server.
     */
    public get app() {
        return this.#app
    }

    /**
     * Returns the event command manager.
     */
    public get commands() {
        return this.#commands as ForgeAPICommandManager
    }

    /**
     * Returns the route manager.
     */
    public get routes() {
        return this.#routes
    }
}