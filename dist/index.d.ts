import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { auth, RouteOptions } from "./structures/manager";
interface IForgeAPIOptions {
    port: number;
    auth?: auth;
}
export declare class ForgeAPI extends ForgeExtension {
    private options;
    private router?;
    name: string;
    description: string;
    version: string;
    constructor(options: IForgeAPIOptions);
    init(client: ForgeClient): void;
    routes: {
        load: (dir: string) => void;
        add: (data: RouteOptions) => void;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map