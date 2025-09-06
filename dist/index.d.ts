import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { auth, QueryType, RouteManager, RouteOptions } from "./core";
interface ForgeAPIOptions {
    port: number;
    auth?: auth;
}
export declare class ForgeAPI extends ForgeExtension {
    private options;
    name: any;
    description: any;
    version: any;
    app: RouteManager;
    constructor(options: ForgeAPIOptions);
    init(client: ForgeClient): void;
    load(path: string): void;
    addRoute<T extends string, QR extends Record<string, QueryType> = {}, QO extends Record<string, QueryType> = {}>(input: RouteOptions<T, QR, QO>): void;
}
export { AuthType, QueryType, createRoute } from "./core";
//# sourceMappingURL=index.d.ts.map