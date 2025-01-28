import { BaseCommand, EventManager, type ForgeClient, ForgeExtension, Interpreter } from "@tryforge/forgescript"
import { AuthType, BackendServer, BackendServerEvents, IForgeAPISetupOptions } from "./BackendServer"
import { ForgeAPICommandManager, handlerName } from "../managers/ForgeAPICommandManager"
import type { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { ForgeAPIRouteOptions, ForgeAPIWebSocketOptions, RawHTTPMethods } from "./ForgeAPIRoute"
import { collectFiles } from "@utils/collectFiles"
import { InternalLogger } from "./InternalLogger"
import { getVersion } from "@utils/getVersion"
import type { WebSocketServer } from "ws"
import jwt from "jsonwebtoken"
import { join } from "path"
import { IncomingMessage } from "http"

/**
 * Type-guard function to check if the given object is
 * a ForgeAPI event.
 * @param data - The object to check.
 * @returns {data is BaseCommand<HTTPMethods>}
 */
function isEvent(data: any): data is BaseCommand<keyof BackendServerEvents> {
    return typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "type")
    && typeof data.type === "string" && Object.prototype.hasOwnProperty.call(data, "code")
    && typeof data.code === "string"
}

/**
 * Type-guard function to check whether the given
 * object is a ForgeAPI route.
 * @param data - The object to check.
 * @returns {data is ForgeAPIRouteOptions}
 */
function isRoute(data: any): data is ForgeAPIRouteOptions {
    return typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "url")
    && typeof data.url === "string" && Object.prototype.hasOwnProperty.call(data, "method")
    && typeof data.method === "string" && Object.prototype.hasOwnProperty.call(data, "handler")
    && (typeof data.handler === "string" || typeof data.handler === "function")
}

function isWebSocket(data: any): data is ForgeAPIWebSocketOptions {
    return typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "name")
    && typeof data.name === "string" && ["open", "close", "message", "error"].includes(data.name)
    && Object.prototype.hasOwnProperty.call(data, "handler")
    && (typeof data.handler === "string" || typeof data.handler === "function")
}

/**
 * API integration for your ForgeScript client.
 */
export class ForgeAPI extends ForgeExtension {
    name = "ForgeAPI"
    description = "The best way to interact with your ForgeScript client and it's server."
    version = getVersion()

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
        if (options.logLevel && typeof options.logLevel === "number") {
            InternalLogger.Priority = options.logLevel
        }
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
            const { auth, handler, method,url } = route
            this.server.app[method.toLowerCase() as RawHTTPMethods](route.url, (req: ExpressRequest, res: ExpressResponse) => {
                if (auth && !this.isAuthed(req)) {
                    InternalLogger.debug(`Access forbidden for URL: ${url}`)
                    return res.status(403).json({ status: 403, message: "Access Forbidden" })
                }

                InternalLogger.debug(`Handling request for URL: "${url}"`)
                try {
                    if (typeof handler === "string") {
                        const compiled = this.server.routes.getRoute(url)!
                        Interpreter.run({
                            obj: {},
                            client: this.#client!,
                            command: compiled as unknown as BaseCommand<any>,
                            data: compiled.compiled!.code,
                            environment: { req, res }
                        })
                    } else {
                        handler({ client: this.#client!, req, res })
                    }
                } catch (err) {
                    this.server.emit("error", err as Error)
                }

                this.server.emit("request", req, res)
            })

            InternalLogger.debug(`Route with URL: "${url}" registered.`)
        }

        return this
    }

    /**
     * Adds a listener for the websocket server.
     * @param listeners - The listeners to be added.
     * @returns {void}
     */
    public addWebsocketListener(...listeners: ForgeAPIWebSocketOptions[]) {
        this.server.websocketRoutes.addRoute(...listeners)

        for (const route of listeners) {
            const { handler, name } = route
            this.server.app.ws.on(name, (req: IncomingMessage) => {
                InternalLogger.debug(`Handling request for websocket URL: "${name}"`)
                try {
                    if (typeof handler === "string") {
                        const compiled = this.server.websocketRoutes.getRoute(name)!
                        Interpreter.run({
                            obj: {},
                            client: this.#client!,
                            command: compiled as unknown as BaseCommand<any>,
                            data: compiled.compiled!.code,
                            environment: { req }
                        })
                    } else {
                        handler({ client: this.#client!, req, ws: this.server.app.ws as unknown as WebSocket })
                    }
                } catch (err) {
                    this.server.emit("error", err as Error)
                }
            })

            InternalLogger.debug(`Websocket route with URL: "${name}" registered.`)
        }

        return this
    }

    /**
     * Load events and routes from the given directory.
     * @param dir - The directory to load files from.
     * @returns {void}
     */
    public load(dir: string) {
        const collectedFiles = collectFiles(dir).map(file => {
            const content = require(file.dir)
            if (content.default) return content.default
            else return content
        })

        for (const data of collectedFiles) {
            const values = Array.isArray(data) ? data : [data]
            values.forEach((file) => {
                if (isRoute(file)) {
                    this.addRoutes(file)
                } else if (isEvent(file)) {
                    this.addEvents(file)
                } else if (isWebSocket(file)) {
                    this.addWebsocketListener(file)
                }
            })
        }
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

        this.load(join(__dirname, "../../natives"))
        if (Array.isArray(this.options.events)) {
            EventManager.load(handlerName, join(__dirname, "../../events"))
            client.events.load(handlerName, this.options.events)
        }

        client.once("ready", (bot) => {
            InternalLogger.info(
                "Your Bearer Token:",
                this.generateBearer(
                    bot.user.id,
                    typeof this.options.auth?.code == "string"
                        ? this.options.auth?.code 
                        : this.options.auth?.code?.[0] ?? "tryforge"
                    )
            )

            this.server.emit("ready")
        })
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
            return (this.validIP(req) || this.checkCode(req)) ?? true
        } else if (config.type === AuthType.Full) {
            return (this.validIP(req) ?? true) && (this.checkCode(req) ?? true)
        }

        return false
    }

    /**
     * Check the IP in the incoming request to match with any
     * of the provided ID's in the ForgeAPI constructor.
     * @param req - Express request object.
     * @returns {boolean}
     */
    private validIP(req: ExpressRequest) {
        const allowedIPs = this.options.auth?.ip?.length
            ? Array.isArray(this.options.auth?.ip)
                ? this.options.auth?.ip
                : [this.options.auth.ip]
            : []
        const result = allowedIPs.some(ip => this.normalizeIp(ip) === (req.ip ?? ""))

        InternalLogger.debug(`IP check result for "${req.ip}": ${result}`)

        return result
    }

    /**
     * Normalizes the given IP address.
     * @param ip - The address to be normalized.
     * @returns {string}
     */
    private normalizeIp(ip: string) {
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/
        const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/

        if (ipv4Regex.test(ip)) {
            InternalLogger.debug(`IPv4 to IPv6: ${ip}`)
            return `::ffff:${ip}`
        }

        if (ipv6Regex.test(ip)) {
            InternalLogger.debug(`Using IPv6: ${ip}`)
            return ip
        }

        throw InternalLogger.error('Invalid IP address(es) provided in config!')
    }

    private checkCode(req: ExpressRequest): boolean | undefined {
        const authData = this.options.auth
        if (!authData) return undefined;

        const token = req.headers.authorization ?? ""
        if (this.options.auth?.bearer) {
            const code = Array.isArray(this.options.auth?.code) ? this.options.auth?.code[0] : this.options.auth?.code ?? ""
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code)
            if (checker === "Error") {
                InternalLogger.debug("Bearer token validation failed")
                return false
            }

            const result = checker.id === this.#client!.user.id
            InternalLogger.debug(`Bearer token validation result: ${result}`)

            return result
        } else if (this.options.auth?.code) {
            const codes = Array.isArray(this.options.auth?.code) ? this.options.auth?.code : [this.options.auth?.code]
            const result = codes.includes(token)

            InternalLogger.debug(`Code validation result: ${result}`)
          
            return result
        } else {
            return true
        }
    }

    /**
     * Generates a bearer token.
     */
    private generateBearer(id: string, key: string) {
        const token = jwt.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".")

        InternalLogger.debug(`Generated bearer token for ID: ${id}`)
        
        return token
    }

    /**
     * Verifies the bearer token with "jwt".
     */
    private checkBearer(token: string, key: string): "Error" | { id: string } {
        try {
            const result = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + token, key) as { id: string }
            InternalLogger.debug(`Bearer token verificaton success`)
            return result
        } catch {
            InternalLogger.debug(`Bearer token verification failed.`)
            return "Error"
        }
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

    /**
     * Returns the websocket server of the ForgeAPI backend.
     */
    public get ws(): WebSocketServer {
        return this.server.app.ws
    }
}