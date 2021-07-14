import type { AnyObject } from '../../types/extend';
const Accounts = require('web3-eth-accounts');

// @ts-ignore
const accounts = new Accounts();

function stringify_v0_1_0(obj: AnyObject) {
    // Implementation error of v0.1.0, retaining error logic for compatibility with data of v0.1.0
    function removeNotSignProperties(obj: AnyObject) {
        obj = JSON.parse(JSON.stringify(obj));
        for (let key in obj) {
            if (key[0] === '@' || key === 'signature') {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                removeNotSignProperties(obj[key]);
            }
        }
        return obj;
    }

    type mulripleStringArray = (string | mulripleStringArray)[];
    function obj2Array(obj: AnyObject): mulripleStringArray[] {
        return Object.keys(obj)
            .sort()
            .map((key) => {
                if (typeof obj[key] === 'object') {
                    return [key, obj2Array(obj[key])];
                } else {
                    return [key, obj[key]];
                }
            });
    }

    let message = obj2Array(removeNotSignProperties(obj));
    return JSON.stringify(message);
}

export default {
    // dirty logic
    check(obj: AnyObject, persona: string) {
        if (!obj.signature) {
            return false;
        } else {
            if (obj['@version'] && obj['@version'] === 'rss3.io/version/v0.1.0') {
                return accounts.recover(stringify_v0_1_0(obj), obj.signature) === persona;
            } else {
                return false;
            }
        }
    },
};
