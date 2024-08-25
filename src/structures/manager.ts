import { ForgeClient } from "@tryforge/forgescript";
import express, { Request, Response } from "express";
import { app } from "@tryforge/webserver";
import { lstatSync, readdirSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

export enum AuthType {
    None = 0,
    Min = 1,
    Full = 2
}

export type auth = { 
    type: AuthType
    ip?: string | string[];
    code?: string | string[]
    bearer?: boolean
}

export interface IRouteManagerOptions { 
    port: number;
    client: ForgeClient;
    auth?: auth
};

const isValidFile = (file: string) => file.endsWith('.js');

type RawHTTPMethods = "get" | "put" | "post" | "delete" | "patch" | "options" | "trace" | "connect";
type HTTPMethods = Uppercase<RawHTTPMethods> | RawHTTPMethods;

export type RouteOptions = {
    url: string;
    method: HTTPMethods | HTTPMethods[];
    auth?: boolean
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
    auth?: boolean
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
    
    constructor(private config: IRouteManagerOptions){
        this.app = app(config.port);
        if(this.config.auth?.bearer) console.log("Your Bearer Token: ",this.generateBearer(this.config.client.user.id, typeof this.config.auth?.code == "string" ? this.config.auth?.code: this.config.auth?.code?.[0] ?? "tryforge"))
    };

    public load(dir: string){
        const root = cwd(),
        files = readdirSync(join(root, dir));
        for (const file of files){
            const stat = lstatSync(join(root, dir, file));
            
            if(stat.isDirectory()) this.load(join(dir, file));
            else if(isValidFile(file)){
                const data: RouteOptions = require(join(root, dir, file));
                this.route(data)
            };
        };
    };

    public route(options:RouteOptions){
        const { url, auth, method, handler } = options;
        if(typeof method == "string") {
            this.app[method.toLowerCase() as RawHTTPMethods](url, (req, res) => {
                if(auth && !this.isAuthed(req)) return res.status(403).json({status: 403, message: "Access Forbidden"})
                 else handler({client: this.config.client, req, res })
            })
        }
    }

    private isAuthed(req: Request) : boolean {
        if(this.config.auth?.type == 0) return true
        else if(this.config.auth?.type == 1){
        let { ip } = this.config.auth
        ip = typeof ip == "string" ? [ip] : ip
            return ip?.includes(req.ip ?? "") ? true : this.checkCode(req.headers.authorization ?? "")
        }
        else if (this.config.auth?.type == 2){
            let { ip } = this.config.auth
            ip = typeof ip == "string" ? [ip] : ip
            if(ip) return (ip.includes(req.ip ?? "") && this.checkCode(req.headers.authorization ?? ""))
                else return this.checkCode(req.headers.authorization ?? "")
        }
        else return true
    }

    private generateBearer(id:string, key: string) {
        jwt.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".")
        return;
    }

    private checkCode(token: string){
        if(this.config.auth?.bearer){
        const code = typeof this.config.auth?.code == "string" ? this.config.auth?.code : this.config.auth?.code?.[0] ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "",  code)
            if(typeof checker == "string" && checker == "Error") return false;
            else return checker.id == this.config.client.user.id
        } else {
            return typeof this.config.auth?.code == "string" ? this.config.auth?.code == token : this.config.auth?.code?.includes(token) ?? true
        }
    }
    private checkBearer(token: string, key: string): "Error" | { id: string } {
        try {
            return jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCIIkpXVCJ9." + token, key) as { id: string };
        } catch (err) {
        return "Error";
    }
}

};