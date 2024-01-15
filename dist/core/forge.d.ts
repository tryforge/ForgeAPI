import { ForgeClient, ForgeExtension } from 'forgescript';
import { APICore, IForgeAPIOptions } from '.';
export declare class ForgeAPI extends ForgeExtension {
    private readonly options;
    static client: ForgeClient;
    static server: APICore;
    static auth: string | string[] | undefined;
    name: string;
    description: string;
    version: string;
    constructor(options: IForgeAPIOptions);
    init(client: ForgeClient): void;
}
//# sourceMappingURL=forge.d.ts.map