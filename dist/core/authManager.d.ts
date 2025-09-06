import { Context } from "hono";
import { auth } from "./types";
import { ForgeClient } from "@tryforge/forgescript";
export declare class AuthManager {
    private client;
    private auth?;
    constructor(client: ForgeClient, auth?: auth | undefined);
    isAuthed(ctx: Context): boolean;
    validIP(ctx: Context): boolean | undefined;
    normalizeIp(ip: string): string;
    checkCode(ctx: Context): boolean | undefined;
    generateBearer(id: string, key: string): string;
    checkBearer(token: string, key: string): "Error" | {
        id: string;
    };
}
//# sourceMappingURL=authManager.d.ts.map