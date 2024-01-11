import { ForgeClient, ForgeExtension } from 'forgescript';
import { APICore } from './core';
interface IForgeAPIOptions {
    port: number;
}
export declare class ForgeAPI extends ForgeExtension {
    private readonly options;
    static client: ForgeClient;
    static server: APICore;
    name: string;
    description: string;
    version: string;
    constructor(options: IForgeAPIOptions);
    init(client: ForgeClient): void;
}
export {};
//# sourceMappingURL=index.d.ts.map