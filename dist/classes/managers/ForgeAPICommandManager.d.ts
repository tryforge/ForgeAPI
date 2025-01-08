import type { BackendServerEvents } from "../structures/BackendServer";
import { BaseCommandManager } from "@tryforge/forgescript";
/**
 * Handler and provider name.
 */
export declare const handlerName = "ForgeAPI";
/**
 * The ForgeAPI command manager.
 */
export declare class ForgeAPICommandManager extends BaseCommandManager<keyof BackendServerEvents> {
    handlerName: string;
}
//# sourceMappingURL=ForgeAPICommandManager.d.ts.map