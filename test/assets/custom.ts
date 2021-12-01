import RSS3 from '../../src/index';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import config from '../../src/config';
import { ethers } from 'ethers';
import id from '../../src/utils/id';

const now = new Date().toISOString();
const mock = new MockAdapter(axios);

const signer = ethers.Wallet.createRandom();
const rss3 = new RSS3({
    endpoint: 'test',
    address: signer.address,
    sign: signer.signMessage.bind(signer),
});

const indexFile = {
    id: rss3.account.address,
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    assets: {
        list_custom: id.getCustomAssets(rss3.account.address, 1),
    },
};
const assets1File = {
    id: id.getCustomAssets(rss3.account.address, 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: ['custom-RSS3-test-1'],
    list_next: id.getCustomAssets(rss3.account.address, 0),
};
const assetTest = 'custom-RSS3-test-0';
const assets0File = {
    id: id.getCustomAssets(rss3.account.address, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: [assetTest],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getCustomAssets(rss3.account.address, 1)}`).replyOnce(200, assets1File);
mock.onGet(`test/${id.getCustomAssets(rss3.account.address, 0)}`).replyOnce(200, assets0File);

test('Assets.custom.getListFile', async () => {
    expect(await rss3.assets.custom.getListFile(rss3.account.address, -1)).toEqual(assets1File);
    expect(await rss3.assets.custom.getListFile(rss3.account.address, 0)).toEqual(assets0File);
});

test('Assets.custom.getList', async () => {
    expect(await rss3.assets.custom.getList(rss3.account.address)).toEqual([...assets1File.list, ...assets0File.list]);
});

test('Assets.custom.delete', async () => {
    await rss3.assets.custom.delete(assetTest);
    expect((await rss3.assets.custom.getListFile(rss3.account.address, 0))?.list).toEqual(undefined);
});

test('Assets.custom.post', async () => {
    const file = JSON.parse(JSON.stringify(await rss3.assets.custom.getListFile(rss3.account.address)));
    file.signature = '0'.repeat(132);
    const assets = [];
    let i = 1;
    while (JSON.stringify(file).length < config.fileSizeLimit) {
        const newItem = `custom-RSS3-test-${i++}`;
        file.list.unshift(newItem);
        assets.push(newItem);
    }
    for (let i = 0; i < assets.length; i++) {
        await rss3.assets.custom.post(assets[i]);
    }
    expect((<any>await rss3.files.get()).assets.list_custom).toBe(id.getCustomAssets(rss3.account.address, 2));
    const lastList = await rss3.assets.custom.getListFile(rss3.account.address);
    expect(lastList?.id).toBe(id.getCustomAssets(rss3.account.address, 2));
    expect(lastList?.list?.length).toBe(1);
});
