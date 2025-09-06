import { Context } from "hono";
import { auth, AuthType } from "./types";
import { ForgeClient, Logger } from "@tryforge/forgescript";
import { sign, verify } from "jsonwebtoken";
import { getConnInfo } from "@hono/node-server/conninfo";

export class AuthManager {
    constructor(
        private client: ForgeClient,
        private auth?: auth
    ){}

    isAuthed(ctx: Context){
        const authConfig = this.auth;
        if (!authConfig) return true;
        switch(authConfig.type){
            case AuthType.None:
                return true;
            case AuthType.Min:
                return (this.validIP(ctx) || this.checkCode(ctx)) ?? true;
            case AuthType.Full:
                return (this.validIP(ctx) ?? true) && (this.checkCode(ctx) ?? true);
        }
    }

    validIP(ctx: Context){
        const allowedIPs = this.auth?.ip
        if(!allowedIPs) return undefined;
        const ipArray = Array.isArray(allowedIPs) ? allowedIPs : [allowedIPs];
        const ip = getConnInfo(ctx).remote.address;
        const result = ipArray.some(i => this.normalizeIp(i) == ip || "");
        Logger.debug(`IP check result for ${ip}: ${result}`);
        return result;
    }

    normalizeIp(ip: string){
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;

        if (ipv4Regex.test(ip)) {
            Logger.debug(`IPv4 to IPv6: ${ip}`);
            return `::ffff:${ip}`;
        }

        if (ipv6Regex.test(ip)) {
            Logger.debug(`Using IPv6: ${ip}`);
            return ip;
        }

        throw Logger.error('Invalid IP address(es) provided in config!');
    }

    checkCode(ctx: Context){
        const authData = this.auth;
        if (!authData) return undefined;
        const token = ctx.req.header("authorization") || "";
        if (this.auth?.bearer) {
            const code = Array.isArray(this.auth?.code) ? this.auth?.code[0] : this.auth?.code ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (checker === "Error") {
                Logger.debug("Bearer token validation failed");
                return false;
            }
            const result = checker.id === this.client.user.id;
            Logger.debug(`Bearer token validation result: ${result}`);
            return result;
        } else if (this.auth?.code) {
            const codes = Array.isArray(this.auth?.code) ? this.auth?.code : [this.auth?.code];
            const result = codes.includes(token);
            Logger.debug(`Code validation result: ${result}`);
            return result;
        } else return true;
    }

    generateBearer(id: string, key: string){
        const token = sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
        Logger.debug(`Generated bearer token for ID: ${id}`);
        return token;
    }

    checkBearer(token: string, key: string): "Error" | { id: string } {
        try {
            const result = verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + token, key) as { id: string };
            Logger.debug(`Bearer token verificaton success`);
            return result;
        } catch (err) {
            Logger.debug(`Bearer token verification failed.`);
            return "Error";
        }
    }
}