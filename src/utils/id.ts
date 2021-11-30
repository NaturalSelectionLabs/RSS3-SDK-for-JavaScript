function parse(id: string) {
    const splited = id.split('-');
    if (splited.length <= 3) {
        return {
            persona: splited[0],
            type: splited[1] || 'index',
            index: splited[2] ? parseInt(splited[2]) : Infinity,
        };
    } else {
        return {
            persona: splited[0],
            type: splited[1],
            payload: splited[2].split('.'),
            index: parseInt(splited[3]),
        };
    }
}

function get(persona: string, type: string, index: number | string, payload?: string[]) {
    let payloadString = '';
    if (Array.isArray(payload)) {
        payloadString = '-' + payload.join('.');
    }
    return `${persona}-${type}${payloadString}-${index}`;
}

export default {
    parse,

    get,

    getCustomItem(persona: string, index: number) {
        return get(persona, 'item', index, ['custom']);
    },

    getAutoItem(persona: string, index: number) {
        return get(persona, 'item', index, ['auto']);
    },

    getCustomItems(persona: string, index: number) {
        return get(persona, 'list', index, ['items', 'custom']);
    },

    getAutoItems(persona: string, index: number) {
        return get(persona, 'list', index, ['items', 'auto']);
    },

    getLinks(persona: string, type: string, index: number | string) {
        return get(persona, 'list', index, ['links', type]);
    },

    getBacklinks(persona: string, type: string, index: number | string) {
        return get(persona, 'list', index, ['backlinks', type]);
    },

    getAssets(persona: string, index: number) {
        return get(persona, 'list', index, ['assets']);
    },

    getItemBacklinks(persona: string, type: string, index: number, itemIndex: number) {
        return get(persona, 'list', index, ['item', itemIndex + '', 'backlinks', type]);
    },

    getAccount(platform: string, identity: string) {
        return `${platform}-${identity}`;
    },

    getAsset(platform: string, identity: string, type: string, uniqueID: string) {
        return `${platform}-${identity}-${type}-${uniqueID}`;
    },

    parseAccount(id: string) {
        const splited = id.split('-');
        return {
            platform: splited[0],
            identity: splited[1],
        };
    },

    parseAsset(id: string) {
        const splited = id.split('-');
        return {
            platform: splited[0],
            identity: splited[1],
            type: splited[2],
            uniqueID: splited[3],
        };
    },
};
