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
        list_auto: id.getAutoAssets(rss3.account.address, 1),
    },
};
const assets1File = {
    id: id.getAutoAssets(rss3.account.address, 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: ['EVM+-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-test-1'],
    list_next: id.getAutoAssets(rss3.account.address, 0),
};
const itemTest = 'EVM+-0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944-test-0';
const assets0File = {
    id: id.getAutoAssets(rss3.account.address, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: [itemTest],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getAutoAssets(rss3.account.address, 1)}`).replyOnce(200, assets1File);
mock.onGet(`test/${id.getAutoAssets(rss3.account.address, 0)}`).replyOnce(200, assets0File);

test('Assets.auto.getListFile', async () => {
    expect(await rss3.assets.auto.getListFile(rss3.account.address, -1)).toEqual(assets1File);
    expect(await rss3.assets.auto.getListFile(rss3.account.address, 0)).toEqual(assets0File);
});

test('Assets.auto.getList', async () => {
    expect(await rss3.assets.auto.getList(rss3.account.address)).toEqual([...assets1File.list, ...assets0File.list]);
});

test('Assets.auto.get', async () => {
    expect(await rss3.assets.auto.get(itemTest)).toEqual(itemTest);
});
