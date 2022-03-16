// @ts-ignore
import stringify from 'json-stringify-deterministic';

export class UtilsObject {
    static removeEmpty(
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
                    this.removeEmpty(obj[key], {
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

    static stringify(obj: any) {
        return stringify(obj);
    }
}
