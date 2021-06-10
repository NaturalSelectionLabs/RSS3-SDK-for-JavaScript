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
};
