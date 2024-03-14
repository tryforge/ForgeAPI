import { ForgeClient, ForgeExtension } from '@tryforge/forgescript';
import { APICore, IForgeAPIOptions } from '.';

export class ForgeAPI extends ForgeExtension{
    public static client: ForgeClient
    public static server: APICore
    public static auth: string | string[] | undefined

    name: string = 'ForgeAPI';
    description: string = 'Powerful API to interact with your discord bot';
    version: string = '0.0.1';

    constructor(private readonly options: IForgeAPIOptions){
        super()
    }
    
    public init(client: ForgeClient): void {
        const api = new APICore(this.options.port)
        api.load('./routes')
        ForgeAPI.server = api
        ForgeAPI.client = client
        ForgeAPI.auth = this.options.authorization
        if(this.options.load) api.load(this.options.load, true);
    }
}