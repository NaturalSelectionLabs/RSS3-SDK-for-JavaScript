import Main from './index';
import axios from 'axios';

class Utils {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    getInstanceURL(instance: string | Instance) {
        if (typeof instance === 'string') {
            return `${this.main.options.endpoint}/${instance}`;
        } else {
            return `${this.main.options.endpoint}/${instance.prefix}:${instance.identity}@${instance.platform}`;
        }
    }

    request(instance: string | Instance, path: string, queries?: AnyObject) {
        for (const key in queries) {
            if (queries[key] && Array.isArray(queries[key])) {
                queries[key] = queries[key].join(',');
            }
        }

        return axios.get(this.main.utils.getInstanceURL(instance) + path, {
            params: Object.assign(
                {},
                {
                    app_name: this.main.options.appName,
                    sdk_version: SDK_VERSION,
                },
                queries,
            ),
        });
    }

    requestURI(uri: string) {
        const url = uri.replace('rss3://', this.main.options.endpoint + '/');

        return axios.get(url);
    }
}

export default Utils;
