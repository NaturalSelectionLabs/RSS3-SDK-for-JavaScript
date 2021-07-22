const Accounts = require('web3-eth-accounts');
import type { AnyObject } from '../../types/extend';
import compatibility from './compatibility';
import type { IOptionsPrivateKey, IOptionsSign } from '../index';

function removeNotSignProperties(obj: AnyObject) {
    obj = JSON.parse(JSON.stringify(obj));
    for (let key in obj) {
        if (key[0] === '@' || key === 'signature') {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            obj[key] = removeNotSignProperties(obj[key]);
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
    async sign(obj: AnyObject, options: IOptionsPrivateKey | IOptionsSign) {
        let signature;
        if ((<IOptionsPrivateKey>options).privateKey) {
            signature = accounts.sign(stringify(obj), (<IOptionsPrivateKey>options).privateKey).signature;
        } else if ((<IOptionsSign>options).id && (<IOptionsSign>options).sign) {
            signature = await (<IOptionsSign>options).sign(stringify(obj));
        }
        obj.signature = signature;
    },

    check(obj: AnyObject, persona: string) {
        if (compatibility.check(obj, persona)) {
            return true;
        }
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
