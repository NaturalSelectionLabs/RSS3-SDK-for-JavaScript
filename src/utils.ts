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

    removeNotSignProperties(obj: any) {
        obj = JSON.parse(JSON.stringify(obj));
        for (let key in obj) {
            if (key[0] === '@' || key === 'signature') {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                this.removeNotSignProperties(obj[key]);
            }
        }
        return obj;
    },
};
