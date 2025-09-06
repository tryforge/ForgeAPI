"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoute = exports.QueryType = exports.AuthType = exports.ForgeAPI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const core_1 = require("./core");
const path_1 = require("path");
const pkg = require('../package.json');
class ForgeAPI extends forgescript_1.ForgeExtension {
    options;
    name = pkg.name;
    description = pkg.description;
    version = pkg.version;
    app;
    constructor(options) {
        super();
        this.options = options;
        this.app = new core_1.RouteManager(options.auth);
    }
    init(client) {
        forgescript_1.FunctionManager.load(this.name, (0, path_1.join)(__dirname, "functions"));
        this.app.registerClient(client);
        this.app.listen(this.options.port);
    }
    load(path) {
        this.app.load(path);
    }
    addRoute(input) { this.app.addRoute(input); }
    ;
}
exports.ForgeAPI = ForgeAPI;
var core_2 = require("./core");
Object.defineProperty(exports, "AuthType", { enumerable: true, get: function () { return core_2.AuthType; } });
Object.defineProperty(exports, "QueryType", { enumerable: true, get: function () { return core_2.QueryType; } });
Object.defineProperty(exports, "createRoute", { enumerable: true, get: function () { return core_2.createRoute; } });
//# sourceMappingURL=index.js.map