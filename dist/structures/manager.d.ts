import { ForgeClient } from "@tryforge/forgescript";
import { app } from "@tryforge/webserver";
export declare enum AuthType {
    None = 0,
    Min = 1,
    Full = 2
}
export type auth = {
    type: AuthType;
    ip?: string | string[];
    code?: string | string[];
    bearer?: boolean;
};
export interface IRouteManagerOptions {
    port: number;
    client: ForgeClient;
    auth?: auth;
}
export declare class RouteManager {
    private config;
    app: ReturnType<typeof app>;
    constructor(config: IRouteManagerOptions);
    load(dir: string): void;
    private route;
    private isAuthed;
    private generateBearer;
    private checkCode;
    private checkBearer;
}
//# sourceMappingURL=manager.d.ts.map