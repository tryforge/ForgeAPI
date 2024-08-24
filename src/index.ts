import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { auth, RouteManager } from "./structures/manager";

interface IForgeAPIOptions {
    port: number;
    auth?: auth
};

export class ForgeAPI extends ForgeExtension {
    private router!: RouteManager;

    name: string = "ForgeAPI";
    description: string = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
    version: string = "1.0.0";
    
    constructor(private options: IForgeAPIOptions){super()}

    init(client: ForgeClient): void {
        this.router = new RouteManager({client, port: this.options.port})
    }

    public routes = {
        load: this.router.load
    }

    public ws = {
        ...this.router.app.ws
    }
}