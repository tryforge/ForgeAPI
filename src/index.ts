import { ForgeClient, ForgeExtension, ReturnType } from "@tryforge/forgescript";
import { auth, RouteManager, RouteOptions } from "./structures";

interface IForgeAPIOptions {
    port: number;
    auth?: auth;
};

export class ForgeAPI extends ForgeExtension {
    private router: RouteManager;

    public ws: typeof this.router.app.ws;
    public routes: {
        load: RouteManager['load'];
        add: RouteManager['route']
    }

    name: string = "ForgeAPI";
    description: string = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
    version: string = "1.0.0";
    
    constructor(options: IForgeAPIOptions){
        super();
        this.router = new RouteManager({...options});

        this.routes = {
            load: this.router.load,
            add: this.router.route
        }

        this.ws = this.router.app.ws;
    };

    init(client: ForgeClient): void {;
        client.once("ready", (cli) => {
            this.router!.init(cli as ForgeClient)
        })
    };
};