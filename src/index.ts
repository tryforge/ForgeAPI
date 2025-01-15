import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { IRouteManagerOptions, RouteManager } from "./structures";

export class ForgeAPI extends ForgeExtension {
  public router: RouteManager;

  public ws: typeof this.router.app.ws;

  name: string = "forge.api";
  description: string = "ForgeAPI, the best way to interact with your ForgeScript bot and it's server.";
  version: string = require("../package.json").version;

  constructor(options: IRouteManagerOptions){
    super();
    this.router = new RouteManager({...options});
    this.ws = this.router.app.ws;
  };

  init(client: ForgeClient): void {;
    client.once("ready", (cli) => {
      this.router!.init(cli as ForgeClient)
    })
  };
};