import { Logger, LogPriority } from "@tryforge/forgescript"

/**
 * Extended logger for the ForgeAPI instance.
 */
export class InternalLogger extends Logger {
    static Priority = LogPriority.Low
}