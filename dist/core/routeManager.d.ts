import { Context as HonoContext, ErrorHandler, Hono, NotFoundHandler } from "hono";
import { auth, QueryType, RouteOptions } from "./types";
import { ForgeClient } from "@tryforge/forgescript";
import { AuthManager } from "./authManager";
export declare class RouteManager {
    private auth?;
    app: Hono;
    authManager: AuthManager;
    client: ForgeClient;
    notAuthedHandler: (c: HonoContext) => Response & import("hono").TypedResponse<"Unauthorized", 401, "text">;
    invalidQueryHandler: (c: HonoContext) => Response & import("hono").TypedResponse<"Invalid query parameters", 400, "text">;
    constructor(auth?: auth | undefined);
    onError(handler: ErrorHandler): void;
    notFound(handler: NotFoundHandler): void;
    registerClient(client: ForgeClient): void;
    load(...dir: string[]): void;
    addRoute<T extends string, QR extends Record<string, QueryType> = {}, QO extends Record<string, QueryType> = {}>(options: RouteOptions<T, QR, QO>): void;
    private isValidRequiredQuery;
    private isOptionalQuery;
    private isValidImageUrl;
    listen(port: number): void;
}
//# sourceMappingURL=routeManager.d.ts.map