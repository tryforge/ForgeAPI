import { ForgeClient, ForgeExtension, FunctionManager } from "@tryforge/forgescript";
import { auth, Context as CTX, QueryType, RouteManager, RouteOptions } from "./core";
import { join } from "path";

interface ForgeAPIOptions {
    port: number
    auth?: auth
}

const pkg = require('../package.json')
export class ForgeAPI  extends ForgeExtension {
    name = pkg.name;
    description = pkg.description;
    version = pkg.version;

    app: RouteManager;

    constructor(private options: ForgeAPIOptions) {
        super()
        this.app = new RouteManager(options.auth)
    }

    init(client: ForgeClient) {
        FunctionManager.load(this.name, join(__dirname, "functions"))
        this.app.registerClient(client)
        this.app.listen(this.options.port)
    }

    load(path: string) {
        this.app.load(path)
    }

    public addRoute<
        T extends string,
        QR extends Record<string, QueryType> = {},
        QO extends Record<string, QueryType> = {}
    >(input: RouteOptions<T, QR, QO>): void { this.app.addRoute(input); };
}

export { AuthType, QueryType, createRoute } from "./core";