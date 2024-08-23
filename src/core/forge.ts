import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { APICore, IForgeAPIOptions } from '.';
import { Logger } from './logger';

export class ForgeAPI extends ForgeExtension{
    public static client: ForgeClient
    public static server: APICore
    public static auth: string | string[] | undefined
    public static authType: 'authorization' | 'ip' | 'custom' | undefined;
    public static debug: boolean = false;

    name: string = 'ForgeAPI';
    description: string = 'Powerful API to interact with your discord bot';
    version: string = '0.0.2';

    constructor(private readonly options: IForgeAPIOptions){
        super()
        ForgeAPI.debug = options.debug || false;
        Logger.debug = ForgeAPI.debug;
    }

    public init(client: ForgeClient): void {
        const api = new APICore(this.options.port)
        api.load('./routes')
        ForgeAPI.server = api;
        ForgeAPI.client = client;
        ForgeAPI.auth = this.options.authorization;
        ForgeAPI.authType = this.options.authType;
        ForgeAPI.debug = this.options.debug || false;
        if(this.options.load) api.load(this.options.load, true);
    }
}