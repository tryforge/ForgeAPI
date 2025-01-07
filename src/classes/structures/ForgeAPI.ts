import { BaseCommand, EventManager, type ForgeClient, ForgeExtension, Interpreter } from "@tryforge/forgescript"
import { ForgeAPICommandManager, handlerName } from "../managers/ForgeAPICommandManager"
import type { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { AuthType, BackendServer, IForgeAPISetupOptions } from "./BackendServer"
import { ForgeAPIRouteOptions, RawHTTPMethods } from "./ForgeAPIRoute"
import { InternalLogger } from "./InternalLogger"
import jwt from "jsonwebtoken"
import { join } from "path"

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
    public get ws(): this['server']['app']['ws'] {
        return this.server.app.ws
    }
}