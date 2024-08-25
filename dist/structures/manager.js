"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = exports.AuthType = void 0;
const webserver_1 = require("@tryforge/webserver");
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var AuthType;
(function (AuthType) {
    AuthType[AuthType["None"] = 0] = "None";
    AuthType[AuthType["Min"] = 1] = "Min";
    AuthType[AuthType["Full"] = 2] = "Full";
})(AuthType || (exports.AuthType = AuthType = {}));
;
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
        if (this.config.auth?.bearer)
            console.log("Your Bearer Token: ", this.generateBearer(client.user.id, typeof this.config.auth?.code == "string" ? this.config.auth?.code : this.config.auth?.code?.[0] ?? "tryforge"));
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
            }
            ;
        }
        ;
    }
    ;
    route(options) {
        const { url, auth, method, handler } = options;
        if (typeof method == "string") {
            this.app[method.toLowerCase()](url, (req, res) => {
                if (auth && !this.isAuthed(req))
                    return res.status(403).json({ status: 403, message: "Access Forbidden" });
                else
                    handler({ client: this.client, req, res });
            });
        }
        ;
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
        return ipArray.includes(req.ip || "");
    }
    checkCode(req) {
        const authData = this.config.auth;
        if (!authData)
            return undefined;
        const token = req.headers.authorization || "";
        if (this.config.auth?.bearer) {
            const code = Array.isArray(this.config.auth?.code) ? this.config.auth?.code[0] : this.config.auth?.code ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (checker === "Error")
                return false;
            return checker.id === this.client.user.id;
        }
        else if (this.config.auth?.code) {
            const codes = Array.isArray(this.config.auth?.code) ? this.config.auth?.code : [this.config.auth?.code];
            return codes.includes(token);
        }
        else
            return true;
    }
    generateBearer(id, key) {
        return jsonwebtoken_1.default.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
    }
    ;
    checkBearer(token, key) {
        try {
            return jsonwebtoken_1.default.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + token, key);
        }
        catch (err) {
            return "Error";
        }
        ;
    }
}
exports.RouteManager = RouteManager;
;
//# sourceMappingURL=manager.js.map