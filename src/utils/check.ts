import config from '../config';
import type { AnyObject } from '../../types/extend';
import { Buffer } from 'buffer';

function valueLength(obj: AnyObject) {
    let result = true;
    for (let key in obj) {
        if (typeof obj[key] === 'object' && !valueLength(obj[key])) {
            result = false;
            break;
        } else if (obj[key].length && obj[key].length > config.maxValueLength) {
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

export default {
    valueLength,

    removeCustomProperties,

    fileSize(obj: AnyObject) {
        if (Buffer.byteLength(JSON.stringify(obj)) > config.maxFileLength) {
            return false;
        } else {
            return true;
        }
    },
};
