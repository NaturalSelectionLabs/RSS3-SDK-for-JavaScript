import Accounts from 'web3-eth-accounts';
import type { AnyObject } from '../../types/extend';

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

function stringify(obj: AnyObject) {
    let message = obj2Array(removeNotSignProperties(obj));
    return JSON.stringify(message);
}

// @ts-ignore
const accounts = new Accounts();

export default {
    sign(obj: AnyObject, privateKey: string) {
        obj.signature = accounts.sign(stringify(obj), privateKey).signature;
    },

    check(obj: AnyObject, persona: string) {
        if (!obj.signature) {
            return false;
        } else {
            return accounts.recover(stringify(obj), obj.signature) === persona;
        }
    },

    privateKeyToAddress(privateKey: string) {
        return accounts.privateKeyToAccount(privateKey).address;
    },

    create() {
        return accounts.create();
    },
};
