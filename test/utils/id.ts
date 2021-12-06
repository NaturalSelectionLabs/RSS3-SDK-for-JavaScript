import id from '../../src/utils/id';
import { utils } from '../../src/index';

const persona = '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944';

test('utils.id', () => {
    expect(utils.id).toBe(id);
});

test('id.getCustomItem', () => {
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

test('id.getCustomAssets', () => {
    expect(id.getCustomAssets(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-assets.custom-100');
});

test('id.getAutoAssets', () => {
    expect(id.getAutoAssets(persona, 100)).toBe('0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-list-assets.auto-100');
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

test('id.getAccount', () => {
    expect(id.getAccount('EVM+', '0x1234567890123456789012345678901234567890')).toBe(
        'EVM+-0x1234567890123456789012345678901234567890',
    );
});

test('id.getAsset', () => {
    expect(id.getAsset('EVM+', '0x1234567890123456789012345678901234567890', 'Ethereum.NFT', '0xxxx')).toBe(
        'EVM+-0x1234567890123456789012345678901234567890-Ethereum.NFT-0xxxx',
    );
});

test('id.parseAccount', () => {
    expect(id.parseAccount('EVM+-0x1234567890123456789012345678901234567890')).toEqual({
        platform: 'EVM+',
        identity: '0x1234567890123456789012345678901234567890',
    });
});

test('id.getAsset', () => {
    expect(id.parseAsset('EVM+-0x1234567890123456789012345678901234567890-Ethereum.NFT-0xxxx')).toEqual({
        platform: 'EVM+',
        identity: '0x1234567890123456789012345678901234567890',
        type: 'Ethereum.NFT',
        uniqueID: '0xxxx',
    });
});
