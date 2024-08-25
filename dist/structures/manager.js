"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = exports.LogLevel = exports.AuthType = void 0;
const webserver_1 = require("@tryforge/webserver");
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("./logger");
var AuthType;
(function (AuthType) {
    AuthType[AuthType["None"] = 0] = "None";
    AuthType[AuthType["Min"] = 1] = "Min";
    AuthType[AuthType["Full"] = 2] = "Full";
})(AuthType || (exports.AuthType = AuthType = {}));
;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Basic"] = 1] = "Basic";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
;
const isValidFile = (file) => file.endsWith('.js');
class RouteManager {
    config;
    app;
    client = undefined;
    constructor(config) {
        this.config = config;
        this.app = (0, webserver_1.app)(config.port);
    }
    init(client) {
        this.client = client;
        if (this.config.auth?.bearer) {
            logger_1.Logger.log("INFO", "Your Bearer Token:", this.generateBearer(client.user.id, typeof this.config.auth?.code == "string" ? this.config.auth?.code : this.config.auth?.code?.[0] ?? "tryforge"));
        }
        if (this.config.logLevel === 2) {
            logger_1.Logger.log("DEBUG", "RouteManager initialized.");
        }
    }
    ;
    load(dir) {
        const root = (0, process_1.cwd)(), files = (0, fs_1.readdirSync)((0, path_1.join)(root, dir));
        for (const file of files) {
            const stat = (0, fs_1.lstatSync)((0, path_1.join)(root, dir, file));
            if (stat.isDirectory())
                this.load((0, path_1.join)(dir, file));
            else if (isValidFile(file)) {
                const data = require((0, path_1.join)(root, dir, file));
                this.route(data);
                logger_1.Logger.log("INFO", `Loaded route from file: ${file}`);
            }
            ;
        }
        ;
    }
    ;
    route(options) {
        const { url, auth, method, handler } = options;
        if (typeof method === "string") {
            this.app[method.toLowerCase()](url, (req, res) => {
                if (auth && !this.isAuthed(req)) {
                    if (this.config.logLevel === 2) {
                        logger_1.Logger.log("DEBUG", `Access forbidden for URL: ${url}`);
                    }
                    return res.status(403).json({ status: 403, message: "Access Forbidden" });
                }
                else {
                    if (this.config.logLevel === 2) {
                        logger_1.Logger.log("DEBUG", `Handling request for URL: ${url}`);
                    }
                    handler({ client: this.client, req, res });
                }
            });
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `Route registered for URL: ${url}`);
            }
        }
    }
    ;
    isAuthed(req) {
        const authConfig = this.config.auth;
        if (!authConfig)
            return true;
        const { type } = authConfig;
        if (type === AuthType.None)
            return true;
        if (type === AuthType.Min) {
            return (this.validIP(req) || this.checkCode(req)) ?? true;
        }
        else if (type === AuthType.Full) {
            return (this.validIP(req) ?? true) && (this.checkCode(req) ?? true);
        }
        return false;
    }
    validIP(req) {
        const allowedIPs = this.config.auth?.ip;
        if (!allowedIPs)
            return undefined;
        const ipArray = Array.isArray(allowedIPs) ? allowedIPs : [allowedIPs];
        const result = ipArray.some(ip => this.normalizeIp(ip) == req.ip || "");
        if (this.config.logLevel === 2) {
            logger_1.Logger.log("DEBUG", `IP check result for ${req.ip}: ${result}`);
        }
        return result;
    }
    normalizeIp(ip) {
        const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^(?:[a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
        if (ipv4Regex.test(ip)) {
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `IPv4 to IPv6: ${ip}`);
            }
            return `::ffff:${ip}`;
        }
        if (ipv6Regex.test(ip)) {
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `Using IPv6: ${ip}`);
            }
            return ip;
        }
        throw logger_1.Logger.log("ERROR", 'Invalid IP address(es) provided in config!');
    }
    checkCode(req) {
        const authData = this.config.auth;
        if (!authData)
            return undefined;
        const token = req.headers.authorization || "";
        if (this.config.auth?.bearer) {
            const code = Array.isArray(this.config.auth?.code) ? this.config.auth?.code[0] : this.config.auth?.code ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (checker === "Error") {
                if (this.config.logLevel === 2) {
                    logger_1.Logger.log("DEBUG", "Bearer token validation failed");
                }
                return false;
            }
            const result = checker.id === this.client.user.id;
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `Bearer token validation result: ${result}`);
            }
            return result;
        }
        else if (this.config.auth?.code) {
            const codes = Array.isArray(this.config.auth?.code) ? this.config.auth?.code : [this.config.auth?.code];
            const result = codes.includes(token);
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `Code validation result: ${result}`);
            }
            return result;
        }
        else {
            return true;
        }
    }
    generateBearer(id, key) {
        const token = jsonwebtoken_1.default.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
        if (this.config.logLevel === 2) {
            logger_1.Logger.log("DEBUG", `Generated bearer token for ID: ${id}`);
        }
        return token;
    }
    ;
    checkBearer(token, key) {
        try {
            const result = jsonwebtoken_1.default.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + token, key);
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `Bearer token verificaton success`);
            }
            return result;
        }
        catch (err) {
            if (this.config.logLevel === 2) {
                logger_1.Logger.log("DEBUG", `Bearer token verification failed.`);
            }
            return "Error";
        }
    }
}
exports.RouteManager = RouteManager;
;
//# sourceMappingURL=manager.js.map