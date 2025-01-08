import type { BackendServerEvents } from "@structures/BackendServer"
import { BaseCommandManager } from "@tryforge/forgescript"

/**
 * Handler and provider name.
 */
export const handlerName = "ForgeAPI"

/**
 * The ForgeAPI command manager.
 */
export class ForgeAPICommandManager extends BaseCommandManager<keyof BackendServerEvents> {
    handlerName: string = handlerName
}