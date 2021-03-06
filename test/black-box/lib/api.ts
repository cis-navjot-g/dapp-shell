import * as dotenv from 'dotenv';
dotenv.config();
import * as request from 'request-promise';
import { Options } from 'request-promise';
import { ApiResponseTest } from './ApiResponseTest';


export interface ApiOptions<T> {
    token?: string;
    body?: T;
    headers?: any;
}


export const api = async <T> (method: string, path: string, options: ApiOptions<T> = {}) => {
    const o: Options = {
        method,
        uri: `${process.env.APP_HOST}:${process.env.APP_PORT}${path}`,
        resolveWithFullResponse: true,
        headers: options.headers,
        json: true,
        body: options.body
    };

    if (options.token) {
        o.headers = {};
        o.headers['authorization'] = `Bearer ${options.token}`;
    }

    let res;
    let error = null;
    try {
        res = await request(o);
    } catch (e) {
        error = e;
        // console.log('error: ', error.error.message);
    }

    return new ApiResponseTest(error, res);
};


export const rpc = async (method: string, params: any[] = [] ): any => {
    const body = { method, params, jsonrpc: '2.0' };
    return await api('POST', '/api/rpc', { body });
};
