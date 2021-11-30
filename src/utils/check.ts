import config from '../config';
import type { AnyObject } from '../../types/extend';
import { Buffer } from 'buffer';
import object from './object';
import { ethers } from 'ethers';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

function valueLength(obj: AnyObject) {
    let result = true;
    for (let key in obj) {
        if (typeof obj[key] === 'object' && !valueLength(obj[key])) {
            result = false;
            break;
        } else if (typeof obj[key] === 'string' && obj[key].length > config.maxValueLength) {
            result = false;
            break;
        }
    }
    return result;
}

function removeCustomProperties(obj: AnyObject) {
    const result = JSON.parse(JSON.stringify(obj));
    for (let key in result) {
        if (key[0] === '_') {
            delete result[key];
        } else if (typeof result[key] === 'object') {
            result[key] = removeCustomProperties(result[key]);
        }
    }
    return result;
}

function fileSize(obj: AnyObject) {
    const toBeObj = JSON.parse(JSON.stringify(obj));
    object.removeEmpty(toBeObj);
    toBeObj.signature = '0'.repeat(132);
    if (Buffer.byteLength(JSON.stringify(toBeObj)) > config.fileSizeLimit) {
        return false;
    } else {
        return true;
    }
}

export default {
    valueLength,

    removeCustomProperties,

    fileSize,

    fileSizeWithNew(obj: AnyObject, newItem: AnyObject | string) {
        const toBeObj = JSON.parse(JSON.stringify(obj));
        toBeObj.list.unshift(newItem);
        return fileSize(toBeObj);
    },

    signature(obj: AnyObject, address: string) {
        if (!obj.signature) {
            return false;
        } else {
            if (obj.agent_signature && obj.agent_id) {
                return (
                    ethers.utils.verifyMessage(`Hi, RSS3. I'm your agent ${obj.agent_id}`, obj.signature) === address &&
                    nacl.sign.detached.verify(
                        new TextEncoder().encode(object.stringifyObj(obj)),
                        naclUtil.decodeBase64(obj.agent_signature),
                        naclUtil.decodeBase64(obj.agent_id),
                    )
                );
            } else {
                return ethers.utils.verifyMessage(object.stringifyObj(obj), obj.signature) === address;
            }
        }
    },
};
