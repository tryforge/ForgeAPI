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
const isValidFile = (file) => file.endsWith('.js');
class RouteManager {
    config;
    app;
    constructor(config) {
        this.config = config;
        this.app = (0, webserver_1.app)(config.port);
    }
    ;
    load(dir) {
        const root = (0, process_1.cwd)(), files = (0, fs_1.readdirSync)((0, path_1.join)(root, dir));
        for (const file of files) {
            const stat = (0, fs_1.lstatSync)((0, path_1.join)(root, dir, file));
            if (stat.isDirectory())
                this.load((0, path_1.join)(dir, file));
            else if (isValidFile(file)) {
                const data = require((0, path_1.join)(root, dir, file)).data;
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
                    handler({ client: this.config.client, req, res });
            });
        }
    }
    isAuthed(req) {
        if (this.config.auth?.type == 0)
            return true;
        else if (this.config.auth?.type == 1) {
            let { ip } = this.config.auth;
            ip = typeof ip == "string" ? [ip] : ip;
            return ip?.includes(req.ip ?? "") ? true : this.checkCode(req.headers.authorization ?? "");
        }
        else if (this.config.auth?.type == 2) {
            let { ip } = this.config.auth;
            ip = typeof ip == "string" ? [ip] : ip;
            if (ip)
                return (ip.includes(req.ip ?? "") && this.checkCode(req.headers.authorization ?? ""));
            else
                return this.checkCode(req.headers.authorization ?? "");
        }
        else
            return true;
    }
    generateBearer(id, key) {
        jsonwebtoken_1.default.sign({ id }, key, {
            noTimestamp: true,
        }).split(".").slice(1).join(".");
        return;
    }
    checkCode(token) {
        if (this.config.auth?.bearer) {
            const code = typeof this.config.auth?.code == "string" ? this.config.auth?.code : this.config.auth?.code?.[0] ?? "";
            const checker = this.checkBearer(token.split("Bearer ")[1] ?? "", code);
            if (typeof checker == "string" && checker == "Error")
                return false;
            else
                return checker.id == this.config.client.user.id;
        }
        else {
            return typeof this.config.auth?.code == "string" ? this.config.auth?.code == token : this.config.auth?.code?.includes(token) ?? true;
        }
    }
    checkBearer(token, key) {
        try {
            return jsonwebtoken_1.default.verify("eyJhbGciOiJIUzI1NiIsInR5cCIIkpXVCJ9." + token, key);
        }
        catch (err) {
            return "Error";
        }
    }
}
exports.RouteManager = RouteManager;
;
//# sourceMappingURL=manager.js.map