import RSS3 from '../src/index';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import config from '../src/config';
import { ethers } from 'ethers';
import id from '../src/utils/id';

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
    assets: id.getAssets(rss3.account.address, 1),
};
const assets1File = {
    id: id.getAssets(rss3.account.address, 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: [
        {
            id: 'EVM+-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-test-1',
            auto: true,
        },
    ],
    list_next: id.getAssets(rss3.account.address, 0),
};
const assetTest: any = {
    id: 'custom-RSS3-test-1',
};
const assets0File = {
    id: id.getAssets(rss3.account.address, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: [assetTest],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getAssets(rss3.account.address, 1)}`).replyOnce(200, assets1File);
mock.onGet(`test/${id.getAssets(rss3.account.address, 0)}`).replyOnce(200, assets0File);

test('Assets.getListFile', async () => {
    expect(await rss3.assets.getListFile(rss3.account.address, -1)).toEqual(assets1File);
    expect(await rss3.assets.getListFile(rss3.account.address, 0)).toEqual(assets0File);
});

test('Assets.getList', async () => {
    expect(await rss3.assets.getList(rss3.account.address)).toEqual([...assets1File.list, ...assets0File.list]);
});

test('Assets.patchTags', async () => {
    await rss3.assets.patchTags(assetTest.id, ['test1']);
    assetTest.tags = ['test1'];
    expect((await rss3.assets.getListFile(rss3.account.address, 0))?.list).toEqual([assetTest]);
});

test('Assets.delete', async () => {
    await rss3.assets.delete(assetTest.id);
    expect((await rss3.assets.getListFile(rss3.account.address, 0))?.list).toEqual(undefined);
});

test('Assets.post', async () => {
    const file = JSON.parse(JSON.stringify(await rss3.assets.getListFile(rss3.account.address)));
    file.signature = '0'.repeat(132);
    const assets = [];
    let i = 1;
    while (JSON.stringify(file).length < config.fileSizeLimit) {
        const newItem = {
            id: `custom-RSS3-test-${i++}`,
        };
        file.list.unshift(newItem);
        assets.push(newItem);
    }
    for (let i = 0; i < assets.length; i++) {
        await rss3.assets.post(assets[i]);
    }
    expect((<any>await rss3.files.get()).assets).toBe(id.getAssets(rss3.account.address, 2));
    const lastList = await rss3.assets.getListFile(rss3.account.address);
    expect(lastList?.id).toBe(id.getAssets(rss3.account.address, 2));
    expect(lastList?.list?.length).toBe(1);
});
