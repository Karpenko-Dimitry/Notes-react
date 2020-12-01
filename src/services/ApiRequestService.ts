import { API_URL } from '../env';

class ApiRequestService {
    static getHost() {
        let host = API_URL;

        while (host[host.length - 1] === '/') {
            host = host.slice(0, host.length - 1);
        }

        return host;
    }

    static resolveUrl(input: string) {
        return input;
    }

    private static async makeHeaders() {
        let headers = {
            Accept: 'application/json',
            'Accept-Language': 'nl',
            'Content-Type': 'application/json',
            ...(localStorage.access_token ? {
                Authorization: 'Bearer ' + localStorage.access_token,
            } : {})
        };

        return headers;
    }

    static get(
        endpoint: string,
        data: any = {},
        headers: any = {},
        auth_redirect: boolean = true,
        cfg = (_cfg: any) => _cfg,
    ) {
        return this.ajax('GET', endpoint, data, headers, auth_redirect, cfg);
    }

    static post(
        endpoint: string,
        data: any = {},
        headers: any = {},
        auth_redirect: boolean = true,
        cfg = (_cfg: any) => _cfg,
    ) {
        return this.ajax('POST', endpoint, data, headers, auth_redirect, cfg);
    }

    static patch(
        endpoint: string,
        data: any = {},
        headers: any = {},
        auth_redirect: boolean = true,
        cfg = (_cfg: any) => _cfg,
    ) {
        return this.ajax('PATCH', endpoint, data, headers, auth_redirect, cfg);
    }

    static put(
        endpoint: string,
        data: any = {},
        headers: any = {},
        auth_redirect: boolean = true,
        cfg = (_cfg: any) => _cfg,
    ) {
        return this.ajax('PUT', endpoint, data, headers, auth_redirect, cfg);
    }

    static _delete(
        endpoint: string,
        data: any = {},
        headers: any = {},
        auth_redirect: boolean = true,
        cfg = (_cfg: any) => _cfg,
    ) {
        return this.ajax('DELETE', endpoint, data, headers, auth_redirect, cfg);
    }

    static ajax(
        method: string,
        endpoint: string,
        data: any = {},
        headers: any = {},
        auth_redirect: boolean = true,
        cfg = (_cfg: any) => _cfg,
    ) {
        return new Promise(async (resolve, reject) => {
            let queryParams: string[] = [];
            let params = {
                method: method,
                headers: Object.assign(await this.makeHeaders(), headers),
            };

            let headerKeys = Object.keys(params.headers);

            for (let i = 0; i < headerKeys.length; i++) {
                if (params.headers[headerKeys[i]] === undefined) {
                    delete params.headers[headerKeys[i]];
                }
            }

            if (typeof data === 'object' && !(data instanceof FormData)) {
                data = JSON.parse(JSON.stringify(data));
            }

            if (typeof auth_redirect === 'undefined') {
                auth_redirect = true;
            }

            if (method === 'GET') {
                let props = Object.keys(data);

                props.forEach((prop) => {
                    if (Array.isArray(data[prop])) {
                        data[prop + '[]'] = data[prop];
                        delete data[prop];
                    } else {
                        queryParams.push(prop + '=' + data[prop]);
                    }
                });
            } else {
                params = {...params, ...{
                    body: !(data instanceof FormData) ? JSON.stringify(data) : data
                }};
            }

            params = cfg(params);

            fetch(
                this.resolveUrl(
                    this.getHost() +
                        endpoint +
                        (queryParams.length > 0 ? '?' + queryParams.join('&') : ''),
                ),
                params,
            ).then(async (res) => {
                let resData = {
                    status: res.status,
                    data: method !== 'DELETE' ? await res.json() : {},
                    response: res,
                };

                if (res.status === 200 || res.status === 201 || res.status === 204) {
                    resolve(resData);
                } else if (res.status === 401) {
                    // await signOut().then(() => navigation.navigate('Welcome'));
                    reject(resData);
                } else {
                    reject(resData);
                }
            });
        });
    }

    static endpointToUrl(endpoint: string) {
        return this.resolveUrl(this.getHost() + (endpoint || ''));
    }
}

export default ApiRequestService;
