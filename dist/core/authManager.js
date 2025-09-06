"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
const types_1 = require("./types");
const forgescript_1 = require("@tryforge/forgescript");
const jsonwebtoken_1 = require("jsonwebtoken");
const conninfo_1 = require("@hono/node-server/conninfo");
class AuthManager {
    client;
    auth;
    constructor(client, auth) {
        this.client = client;
        this.auth = auth;
    }
    isAuthed(ctx) {
        const authConfig = this.auth;
        if (!authConfig)
            return true;
        switch (authConfig.type) {
            case types_1.AuthType.None:
                return true;
            case types_1.AuthType.Min:
                return (this.validIP(ctx) || this.checkCode(ctx)) ?? true;
            case types_1.AuthType.Full:
                return (this.validIP(ctx) ?? true) && (this.checkCode(ctx) ?? true);
        }
    }
    validIP(ctx) {
        const allowedIPs = this.auth?.ip;
        if (!allowedIPs)
            return undefined;
        const ipArray = Array.isArray(allowedIPs) ? allowedIPs : [allowedIPs];
        const ip = (0, conninfo_1.getConnInfo)(ctx).remote.address;
        const result = ipArray.some(i => this.normalizeIp(i) == ip || "");
        forgescript_1.Logger.debug(`IP check result for ${ip}: ${result}`);
        return result;
    }
    normalizeIp(ip) {
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
        if (ipv4Regex.test(ip)) {
            forgescript_1.Logger.debug(`IPv4 to IPv6: ${ip}`);
            return `::ffff:${ip}`;
        }
        if (ipv6Regex.test(ip)) {
            forgescript_1.Logger.debug(`Using IPv6: ${ip}`);
            return ip;
        }
        throw forgescript_1.Logger.error('Invalid IP address(es) provided in config!');
    }
    checkCode(ctx) {
        const authData = this.auth;
        if (!authData)
            return undefined;
        const token = ctx.req.header("authorization") || "";
        if (this.auth?.bearer) {
            const code = Array.isArray(this.auth?.code) ? this.auth?.code[0] : this.auth?.code ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (checker === "Error") {
                forgescript_1.Logger.debug("Bearer token validation failed");
                return false;
            }
            const result = checker.id === this.client.user.id;
            forgescript_1.Logger.debug(`Bearer token validation result: ${result}`);
            return result;
        }
        else if (this.auth?.code) {
            const codes = Array.isArray(this.auth?.code) ? this.auth?.code : [this.auth?.code];
            const result = codes.includes(token);
            forgescript_1.Logger.debug(`Code validation result: ${result}`);
            return result;
        }
        else
            return true;
    }
    generateBearer(id, key) {
        const token = (0, jsonwebtoken_1.sign)({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
        forgescript_1.Logger.debug(`Generated bearer token for ID: ${id}`);
        return token;
    }
    checkBearer(token, key) {
        try {
            const result = (0, jsonwebtoken_1.verify)("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + token, key);
            forgescript_1.Logger.debug(`Bearer token verificaton success`);
            return result;
        }
        catch (err) {
            forgescript_1.Logger.debug(`Bearer token verification failed.`);
            return "Error";
        }
    }
}
exports.AuthManager = AuthManager;
//# sourceMappingURL=authManager.js.map