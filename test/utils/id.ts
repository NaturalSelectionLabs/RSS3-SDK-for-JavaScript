import id from '../../src/utils/id';

const persona = '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944';

test('id.getItem', () => {
    expect(id.getItem(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-item-100');
});

test('id.getItems', () => {
    expect(id.getItems(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-items-100');
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
        payload: null,
        index: Infinity,
    });

    expect(id.parse(id.getItem(persona, 100))).toEqual({
        persona,
        type: 'item',
        payload: null,
        index: 100,
    });

    expect(id.parse(id.getItems(persona, 100))).toEqual({
        persona,
        type: 'list',
        payload: 'items',
        index: 100,
    });

    expect(id.parse(id.getLinks(persona, 'follow', 100))).toEqual({
        persona,
        type: 'list',
        payload: 'links.follow',
        index: 100,
    });
});
