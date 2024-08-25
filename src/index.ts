import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { auth, RouteManager, RouteOptions } from "./structures";

interface IForgeAPIOptions {
    port: number;
    auth?: auth;
};

export class ForgeAPI extends ForgeExtension {
    private router?: RouteManager;

    name: string = "ForgeAPI";
    description: string = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
    version: string = "1.0.0";
    
    constructor(private options: IForgeAPIOptions){super();};

    init(client: ForgeClient): void {
        this.router = new RouteManager({...this.options});
        client.once("ready", (cli) => {
            this.router!.init(cli as ForgeClient)
        })
    };

    public routes = {
        load: (dir: string) => {
            if(this.router) this.router.load(dir);
                else this.routes.load(dir);
        },
        add: (data: RouteOptions) => {
            if(this.router) this.router.route(data);
                else this.routes.add(data);
        }
    };

    public ws = {
        load: (dir: string) => {
            if(this.router) this.router.load(dir);
                else this.routes.load(dir);
        },
        add: (data: RouteOptions) => {
            if(this.router) this.router.route(data);
                else this.routes.add(data);
        }
    };
};