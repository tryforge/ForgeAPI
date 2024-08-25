import { ForgeClient } from "@tryforge/forgescript";
import { Request, Response, Router } from "express";
import { app } from "@tryforge/webserver";
import { lstatSync, readdirSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { Logger } from "./logger";

export enum AuthType {
    None = 0,
    Min = 1,
    Full = 2
};

export type auth = { 
    type: AuthType;
    ip?: string | string[];
    code?: string | string[]
    bearer?: boolean;
};

export enum LogLevel {
    None = 0,
    Basic = 1,
    Debug = 2
}

export interface IRouteManagerOptions { 
    port: number;
    auth?: auth;
    logLevel?: LogLevel
};

const isValidFile = (file: string) => file.endsWith('.js');

type RawHTTPMethods = "get" | "put" | "post" | "delete" | "patch" | "options" | "trace" | "connect";
type HTTPMethods = Uppercase<RawHTTPMethods> | RawHTTPMethods;

export type RouteOptions = {
    url: string;
    method: HTTPMethods | HTTPMethods[];
    auth?: boolean;
    handler: (
        ctx: {
            client: ForgeClient;
            req: Request;
            res: Response;
        }
    ) => Promise<void> | void;
};

export type WsOptions = {
    url?: string;
    auth?: boolean;
    handler: (
        ctx: {
            client: ForgeClient;
            ws: WebSocket;
            req: IncomingMessage;
        }
    ) => Promise<void> | void;
};

export class RouteManager {
    app: ReturnType<typeof app>;
    private client?: ForgeClient = undefined;

    constructor(private config: IRouteManagerOptions){
        this.app = app(config.port);
    }

    public init(client: ForgeClient) {
        this.client = client
        if(this.config.auth?.bearer) Logger.log("INFO", "Your Bearer Token:",this.generateBearer(client.user.id, typeof this.config.auth?.code == "string" ? this.config.auth?.code: this.config.auth?.code?.[0] ?? "tryforge"));
    };

    public load(dir: string){
        const root = cwd(),
        files = readdirSync(join(root, dir));
        for (const file of files){
            const stat = lstatSync(join(root, dir, file));

            if(stat.isDirectory()) this.load(join(dir, file));
            else if(isValidFile(file)){
                const data: RouteOptions = require(join(root, dir, file));
                this.route(data);
            };
        };
    };

    public route(options:RouteOptions){
        const { url, auth, method, handler } = options;
        if(typeof method == "string") {
            this.app[method.toLowerCase() as RawHTTPMethods](url, (req, res) => {
                if(auth && !this.isAuthed(req)) return res.status(403).json({status: 403, message: "Access Forbidden"});
                    else handler({client: this.client!, req, res });
            });
        };
    };

    private isAuthed(req: Request): boolean {
        const authConfig = this.config.auth;
        if (!authConfig) return true;
        const { type } = authConfig;

        if (type === AuthType.None) return true;
    
        if (type === AuthType.Min) {
            return (this.validIP(req) || this.checkCode(req)) ?? true;
        } else if (type === AuthType.Full) {
            return (this.validIP(req) ?? true) && (this.checkCode(req) ?? true);
        }
    
        return false;
    }
    
    private validIP(req: Request){
        const allowedIPs = this.config.auth?.ip
        if(!allowedIPs) return undefined;
        const ipArray = Array.isArray(allowedIPs) ? allowedIPs : [allowedIPs]
        return ipArray.some(ip => this.normalizeIp(ip) == req.ip || "")
    }

    private normalizeIp(ip: string): string {
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
    
        if (ipv4Regex.test(ip)) {
            return `::ffff:${ip}`;
        }
    
        if (ipv6Regex.test(ip)) {
            return ip;
        }
    
        throw Logger.log("ERROR", 'Invalid IP address(es) provided in config!');
    }

    private checkCode(req: Request): boolean | undefined {
        const authData = this.config.auth
        if(!authData) return undefined;
        const token = req.headers.authorization || ""
        if (this.config.auth?.bearer) {
            const code = Array.isArray(this.config.auth?.code) ? this.config.auth?.code[0] : this.config.auth?.code ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (checker === "Error") return false;
            return checker.id === this.client!.user.id;
        } else if(this.config.auth?.code) {
            const codes = Array.isArray(this.config.auth?.code) ? this.config.auth?.code : [this.config.auth?.code];
            return codes.includes(token);
        } else return true
    }
    
    private generateBearer(id:string, key: string) {
        return jwt.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
    };

    private checkBearer(token: string, key: string): "Error" | { id: string } {
        try {
            return jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."+token, key) as { id: string };
        } catch (err) {
            return "Error";
        };
    }    
};