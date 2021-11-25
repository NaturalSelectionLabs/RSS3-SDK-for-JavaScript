import id from '../../src/utils/id';

const persona = '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944';

test('id.getCustomItems', () => {
    expect(id.getCustomItem(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-item-custom-100');
});

test('id.getAutoItems', () => {
    expect(id.getAutoItem(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-item-auto-100');
});

test('id.getCustomItems', () => {
    expect(id.getCustomItems(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-items.custom-100');
});

test('id.getAutoItems', () => {
    expect(id.getAutoItems(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-items.auto-100');
});

test('id.getLinks', () => {
    expect(id.getLinks(persona, 'follow', 100)).toBe(
        '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-links.follow-100',
    );
});

test('id.getBacklinks', () => {
    expect(id.getBacklinks(persona, 'follow', 100)).toBe(
        '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-backlinks.follow-100',
    );
});

test('id.getAssets', () => {
    expect(id.getAssets(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-assets-100');
});

test('id.getItemBacklinks', () => {
    expect(id.getItemBacklinks(persona, 'comment', 100, 10)).toBe(
        '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-item.10.backlinks.comment-100',
    );
});

test('id.parse', () => {
    expect(id.parse(persona)).toEqual({
        persona,
        type: 'index',
        index: Infinity,
    });

    expect(id.parse(id.getCustomItem(persona, 100))).toEqual({
        persona,
        type: 'item',
        payload: ['custom'],
        index: 100,
    });

    expect(id.parse(id.getAutoItem(persona, 100))).toEqual({
        persona,
        type: 'item',
        payload: ['auto'],
        index: 100,
    });

    expect(id.parse(id.getAutoItems(persona, 100))).toEqual({
        persona,
        type: 'list',
        payload: ['items', 'auto'],
        index: 100,
    });

    expect(id.parse(id.getCustomItems(persona, 100))).toEqual({
        persona,
        type: 'list',
        payload: ['items', 'custom'],
        index: 100,
    });

    expect(id.parse(id.getLinks(persona, 'follow', 100))).toEqual({
        persona,
        type: 'list',
        payload: ['links', 'follow'],
        index: 100,
    });
});
