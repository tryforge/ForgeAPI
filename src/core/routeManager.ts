import { Context as HonoContext, ErrorHandler, Hono, NotFoundHandler, Next } from "hono";
import { auth, Context, HTTPMethod, QueryType, RouteOptions } from "./types";
import { BaseCommand, Compiler, ForgeClient, Interpreter, Logger } from "@tryforge/forgescript";
import { lstatSync, readdirSync } from "fs";
import { serve } from "@hono/node-server";
import { join, resolve } from "path";
import { AuthManager } from "./authManager";
import { cwd } from "process";
import { BlankEnv } from "hono/types";

const isValidFile = (file: string) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts'));

export class RouteManager {
    app: Hono;
    authManager!: AuthManager
    client!: ForgeClient

    notAuthedHandler = (c: HonoContext) => c.text("Unauthorized", 401)
    invalidQueryHandler = (c: HonoContext) => c.text("Invalid query parameters", 400)

    constructor(private auth?: auth) {
        this.app = new Hono()
    }

    onError(handler: ErrorHandler){
        this.app.onError(handler)
    }

    notFound(handler: NotFoundHandler){
        this.app.notFound(handler)
    }

    registerClient(client: ForgeClient){
        this.client = client
        this.authManager = new AuthManager(this.client, this.auth)
    }

    load(...dir: string[]) {
        const root = join(cwd(), ...dir);
        const files = readdirSync(root);

        for(const file of files){
            const path = join(root, file);
            const stat = lstatSync(path);

            if(stat.isDirectory()) this.load(path);
            else if(stat.isFile() && isValidFile(file)){
                const req = require(path);
                const data = (req.default || req) as RouteOptions<string, Record<string, QueryType>, Record<string, QueryType>>;

                this.addRoute(data)
            }
        }
    }

    public addRoute<
        T extends string,
        QR extends Record<string, QueryType> = {},
        QO extends Record<string, QueryType> = {}
    >(options: RouteOptions<T, QR, QO>): void {
        let command = null;
        if(typeof options.handler == "string"){
            command = new BaseCommand({
                type: "route",
                code: options.handler,
            })
        }
        const handler = async (ctx: Context<T, QR, QO>, next: Next) => {
            if(command){
                const promise = await new Promise(async (resolve) => {
                    await Interpreter.run({
                        obj: {},
                        client: this.client,
                        data: command.compiled.code,
                        command,
                        extras: { ctx, next, resolve }
                    })
                    resolve(next())
                })

                return promise;
            }
            return (options.handler as Function)(ctx, next)
        }
        
        if(!Array.isArray(options.method)) options.method = [options.method];
        for(const method of options.method){
            const { required, optional } = options.query ?? {};
            this.app[method.toLowerCase() as Lowercase<HTTPMethod>](options.url, async (c: HonoContext<BlankEnv, string>, next) => {
                if(options.auth && !this.authManager.isAuthed(c)){
                    Logger.debug("Unauthorized access to " + options.url);
                    return this.notAuthedHandler(c);
                }
                Logger.debug("Access given to " + options.url);

                const query = c.req.query() as Record<string, any>;
                const promise = await Promise.all([
                    this.isValidRequiredQuery(query, required ?? {}),
                    this.isOptionalQuery(query, optional ?? {})
                ])
                if(!promise[0] || !promise[1]) return this.invalidQueryHandler(c);
                const ctx = Object.assign(c, { query, client: this.client }) as any as Context<T, QR, QO>
                return handler(ctx, next);
            });
            Logger.info("Loaded", method.toUpperCase(), options.url);
        }
    }

    private async isValidRequiredQuery(query: Record<string, any>, required: Record<string, QueryType>): Promise<boolean> {
        const arr = Object.keys(query)
        const filter = Object.keys(required).filter((key) => !arr.includes(key))
        
        if(filter.length > 0) return false;
        for(const key of arr){
            switch(required[key as any]){
                case QueryType.String:
                    query[key] = query[key] as string;
                    break;
                case QueryType.Number:
                    query[key] = Number(query[key]);
                    if(isNaN(query[key])) return false;
                    break;
                case QueryType.Boolean:
                    if(query[key] !== "true" && query[key] !== "false") return false;
                    query[key] = query[key] === "true";
                    break;
                case QueryType.Image:
                    const image = await this.isValidImageUrl(query[key])
                    if(!image) return false;
                    query[key] = image;
                    break;
            }
        }
        return true;
    }

    private async isOptionalQuery(query: Record<string, any>, optional: Record<string, QueryType>): Promise<boolean> {
        const arr = Object.keys(query)

        for(const key of arr){
            if(!query[key]) continue;
            switch(optional[key as any]){
                case QueryType.String:
                    query[key] = query[key] as string;
                    break;
                case QueryType.Number:
                    query[key] = Number(query[key]);
                    if(isNaN(query[key])) return false;
                    break;
                case QueryType.Boolean:
                    if(query[key] !== "true" && query[key] !== "false") return false;
                    query[key] = query[key] === "true";
                    break;
                case QueryType.Image:
                    const image = await this.isValidImageUrl(query[key])
                    if(!image) return false;
                    query[key] = image;
                    break;
            }
        }
        return true;
    }

    private async isValidImageUrl(url: string): Promise<false | Buffer> {
        try {
            const res = await fetch(url)
            const contentType = res.headers.get('content-type') || ''
            if(res.ok && contentType.startsWith('image/')) return Buffer.from(await res.arrayBuffer());
            return false
        } catch (err) {
            return false
        }
    }

    listen(port: number) { 
        serve({ fetch: this.app.fetch, port })
    }
}