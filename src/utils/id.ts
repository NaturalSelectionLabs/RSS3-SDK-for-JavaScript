function parse(id: string) {
    const splited = id.split('-');
    return {
        persona: splited[0],
        type: splited[1] || 'index',
        index: splited[2] !== undefined ? parseInt(splited[2]) : Infinity,
    };
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

    getItem(persona: string, index: number) {
        return get(persona, 'item', index);
    },

    getItems(persona: string, index: number) {
        return get(persona, 'list', index, ['items']);
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
};
