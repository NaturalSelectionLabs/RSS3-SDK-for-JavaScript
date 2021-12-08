import type { AnyObject } from '../../types/extend';

function removeEmpty(
    obj: any,
    father?: {
        obj: any;
        key: string;
    },
) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            if (!obj[key] || Object.keys(obj[key]).length === 0) {
                delete obj[key];
            } else {
                removeEmpty(obj[key], {
                    obj,
                    key,
                });
            }
        } else if (!obj[key]) {
            delete obj[key];
        }
    }
    if (Object.keys(obj).length === 0 && father) {
        delete father.obj[father.key];
    }
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
    removeEmpty,

    stringifyObj: (obj: AnyObject) => {
        const removeNotSignProperties = (obj: AnyObject) => {
            obj = JSON.parse(JSON.stringify(obj));
            for (let key in obj) {
                if (key === 'signature' || key === 'agent_signature') {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    if (obj[key].auto) {
                        delete obj[key];
                    } else {
                        obj[key] = removeNotSignProperties(obj[key]);
                    }
                }
            }
            return obj;
        };

        type mulripleStringArray = (string | mulripleStringArray)[];
        const obj2Array = (obj: AnyObject): mulripleStringArray[] => {
            return Object.keys(obj)
                .sort()
                .map((key) => {
                    if (typeof obj[key] === 'object') {
                        return [key, obj2Array(obj[key])];
                    } else {
                        return [key, obj[key]];
                    }
                });
        };

        let message = obj2Array(removeNotSignProperties(obj));
        return JSON.stringify(message);
    },

    removeCustomProperties,
};
