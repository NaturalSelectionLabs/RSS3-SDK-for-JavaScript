function removeEmpty(
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
                removeEmpty(obj[key], {
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
}

export default {
    removeEmpty,
};
