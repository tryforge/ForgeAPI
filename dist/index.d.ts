import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { auth, RouteManager } from "./structures";
interface IForgeAPIOptions {
    port: number;
    auth?: auth;
}
export declare class ForgeAPI extends ForgeExtension {
    private router;
    ws: typeof this.router.app.ws;
    routes: {
        load: RouteManager['load'];
        add: RouteManager['route'];
    };
    name: string;
    description: string;
    version: string;
    constructor(options: IForgeAPIOptions);
    init(client: ForgeClient): void;
}
export {};
//# sourceMappingURL=index.d.ts.map