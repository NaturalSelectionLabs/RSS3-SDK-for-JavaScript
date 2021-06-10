import config from './config';
import EthCrypto from 'eth-crypto';

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

function hash(obj: AnyObject) {
    let message = obj2Array(removeNotSignProperties(obj));
    return EthCrypto.hash.keccak256(JSON.stringify(message));
}

export default {
    removeEmptyProperties(
        obj: any,
        father?: {
            obj: any;
            key: string;
        },
    ) {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                } else {
                    this.removeEmptyProperties(obj[key], {
                        obj,
                        key,
                    });
                }
            } else if (!obj[key]) {
                delete obj[key];
            }
        }
        if (Object.keys(obj).length === 0) {
            delete father.obj[father.key];
        }
    },

    attributeslengthCheck(obj: any) {
        let result = true;
        for (let key in obj) {
            if (typeof obj[key] === 'object' && !this.attributeslengthCheck(obj[key])) {
                result = false;
                break;
            } else if (obj[key].length && obj[key].length > config.maxValueLength) {
                result = false;
                break;
            }
        }
        return result;
    },

    sign(obj: AnyObject, privateKey: string) {
        obj.signature = EthCrypto.sign(privateKey, hash(obj));
    },

    check(obj: AnyObject, persona: string) {
        if (!obj.signature) {
            return false;
        } else {
            return EthCrypto.recover(obj.signature, hash(obj)) === persona;
        }
    },

    parseID(id: string) {
        const splited = id.split('-');
        return {
            persona: splited[0],
            type: splited[1] || 'index',
            index: splited[2] !== undefined ? parseInt(splited[2]) : Infinity,
        };
    },
};
