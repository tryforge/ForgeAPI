import { BaseCommand, type ForgeClient, ForgeExtension, Interpreter, Logger } from "@tryforge/forgescript"
import type { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { ForgeAPICommandManager } from "../managers/ForgeAPICommandManager"
import { AuthType, BackendServer, IForgeAPISetupOptions } from "./BackendServer"
import { ForgeAPIRouteOptions, RawHTTPMethods } from "./ForgeAPIRoute"

/**
 * API integration for your ForgeScript client.
 */
export class ForgeAPI extends ForgeExtension {
    name = "ForgeAPI"
    description = ""
    version = ""

    /**
     * The ForgeClient instance.
     */
    #client: ForgeClient | null = null
    /**
     * ForgeAPI's backend.
     */
    #server: BackendServer | null = null
    constructor(private options: IForgeAPISetupOptions) {
        super()
    }

    /**
     * Add event commands to ForgeAPI.
     * @param events - The events to be added.
     * @returns {ForgeAPI}
     */
    public addEvents(...events: Parameters<ForgeAPICommandManager['add']>) {
        this.server.commands.add(...events)
        return this
    }

    /**
     * Add routes to ForgeAPI.
     * @param routes - The routes to be added.
     * @returns {ForgeAPI}
     */
    public addRoutes(...routes: ForgeAPIRouteOptions[]) {
        this.server.routes.addRoute(...routes)

        for (const route of routes) {
            const { handler, method,url } = route
            this.server.app[method.toLowerCase() as RawHTTPMethods](route.url, (req: ExpressRequest, res: ExpressResponse) => {
                if (typeof handler === "string") {
                    const compiled = this.server.routes.getRoute(url)!
                    Interpreter.run({
                        obj: {},
                        client: this.#client!,
                        command: compiled as unknown as BaseCommand<any>,
                        data: compiled.compiled!.code
                    })
                } else {
                    handler({ client: this.#client!, req, res })
                }
            })

            Logger.debug(`Route with URL: "${url}" registered.`)
        }

        return this
    }

    /**
     * Starts the ForgeAPI extension.
     * @param client - The ForgeClient instance to attach the extension to.
     * @returns {void}
     */
    public init(client: ForgeClient) {
        this.#client = client
        this.#server = new BackendServer(this.options)
        this.#server.init(client)

        this.server.emit("ready")
    }

    /**
     * Check whether the given request is authed.
     * @param req 
     * @returns {boolean}
     */
    private isAuthed(req: ExpressRequest) {
        const config = this.options.auth
        if (!config) return true;

        if (config.type === AuthType.None) return true;
        if (config.type === AuthType.Min) {

        } else if (config.type === AuthType.Full) {

        }

        return false
    }

    /**
     * Returns the ForgeAPICommandManager instance.
     */
    public get commands() {
        return this.server.commands
    }

    /**
     * Returns the backend of the ForgeAPI.
     */
    public get server() {
        return this.#server as BackendServer
    }

    /**
     * Returns the ForgeAPIRouteManager instance.
     */
    public get routes() {
        return this.server.routes
    }
}