/* eslint-disable @typescript-eslint/ban-types */
import http from 'http';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

export type ServerResponse<T = undefined> = T extends undefined
	? http.ServerResponse
	: http.ServerResponse & T;
export type IncomingMessage<T = undefined> = T extends undefined
	? http.IncomingMessage
	: http.IncomingMessage & T;

export type ReqType<Type extends 'ssr' | 'api' | 'both'> = Type extends 'api'
	? NextApiRequest
	: Type extends 'both'
	? IncomingMessage
	: GetServerSidePropsContext['req'];

export type ResType<Type extends 'ssr' | 'api' | 'both'> = Type extends 'api'
	? NextApiResponse
	: Type extends 'both'
	? ServerResponse
	: GetServerSidePropsContext['res'];

export type HandlerData<Type extends 'ssr' | 'api' = 'api', Req = {}, Res = {}> = {
	ignoredMiddleware: string[];
	handler: (req: ReqType<Type> & Req, res: ResType<Type> & Res) => void | Promise<void>;
};

export type RouteHandlerMiddleware<
	Type extends 'ssr' | 'api' | 'both' = 'api',
	Req = {},
	Res = {},
> = {
	key: string;
	ssr: boolean;
	middleware: (
		req: ReqType<Type> & Req,
		res: ResType<Type> & Res,
		end: (lastRes: (lastRes: ResType<Type> & Res) => void) => void,
		env: 'ssr' | 'api',
	) => void | Promise<void>;
};

export type RouteHandlerOnError<Type extends 'ssr' | 'api' = 'api'> = (
	req: ReqType<Type>,
	res: ResType<Type>,
	err: unknown,
) => void | Promise<void>;

export interface RouteHandlerConstructor<Type extends 'ssr' | 'api' = 'api', Req = {}, Res = {}> {
	defaultMiddlewares?: RouteHandlerMiddleware<Type, ReqType<Type> & Req, ResType<Type> & Res>[];
	onError?: RouteHandlerOnError<Type>;
	ssr: true | false;
}
