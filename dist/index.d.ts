import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { auth } from "./structures/manager";
interface IForgeAPIOptions {
    port: number;
    auth?: auth;
}
export declare class ForgeAPI extends ForgeExtension {
    private options;
    private router;
    name: string;
    description: string;
    version: string;
    constructor(options: IForgeAPIOptions);
    init(client: ForgeClient): void;
    routes: {
        load: (dir: string) => void;
    };
    ws: {
        options: import("ws").ServerOptions<typeof import("ws"), typeof import("http").IncomingMessage>;
        path: string;
        clients: Set<import("ws")>;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map