import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { IRouteManagerOptions, RouteManager } from "./structures";
export declare class ForgeAPI extends ForgeExtension {
    router: RouteManager;
    ws: typeof this.router.app.ws;
    name: string;
    description: string;
    version: string;
    constructor(options: IRouteManagerOptions);
    init(client: ForgeClient): void;
}
//# sourceMappingURL=index.d.ts.map