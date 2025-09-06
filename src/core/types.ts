import { BlankEnv, Next } from "hono/types";
import { Context as HonoContext } from "hono";
import { ForgeClient } from "@tryforge/forgescript";

type RawHTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type HTTPMethod = Lowercase<RawHTTPMethod> | RawHTTPMethod;

export enum QueryType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Image = "image"
}

export type QueryValue<T extends QueryType> =
    T extends QueryType.String ? string :
    T extends QueryType.Number ? number :
    T extends QueryType.Boolean ? boolean :
    T extends QueryType.Image ? Buffer : never;

export type QueryValues<
    QR extends Record<string, QueryType>,
    QO extends Record<string, QueryType>
> = {
    [key in keyof QR]: QueryValue<QR[key]>;
} & Partial<{
    [key in keyof QO]?: QueryValue<QO[key]>;
}>;

export type Context<P extends string = any, QR extends Record<string, QueryType> = {}, QO extends Record<string, QueryType> = {}> = HonoContext<BlankEnv, P> & { query: QueryValues<QR, QO>; client: ForgeClient };

export interface RouteOptions<
    P extends string,
    QR extends Record<string, QueryType>,
    QO extends Record<string, QueryType>
>{
    url: P;
    query?: {
        required?: QR;
        optional?: QO;
    };
    auth?: boolean;
    method: HTTPMethod | HTTPMethod[];
    handler: string | ((c: Context<P, QR, QO>, next: Next) => any);
};

export function createRoute<
    T extends string,
    QR extends Record<string, QueryType> = {},
    QO extends Record<string, QueryType> = {}
>(input: RouteOptions<T, QR, QO>): RouteOptions<T, QR, QO> { return input; };


export enum AuthType {
    None = 0,
    Min = 1,
    Full = 2
};

export type auth = {
    type: AuthType;
    ip?: string | string[];
    code?: string | string[]
    bearer?: boolean;
};