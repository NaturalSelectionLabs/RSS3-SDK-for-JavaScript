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
    backlinks: [
        {
            auto: true,
            type: 'test',
            list: id.getBacklinks(rss3.account.address, 'test', 1),
        },
    ],
};
const backlinks1File = {
    id: id.getBacklinks(rss3.account.address, 'test', 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: ['1', '2'],
    list_next: id.getBacklinks(rss3.account.address, 'test', 0),
};
const backlinks0File = {
    id: id.getBacklinks(rss3.account.address, 'test', 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: ['3'],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getBacklinks(rss3.account.address, 'test', 1)}`).replyOnce(200, backlinks1File);
mock.onGet(`test/${id.getBacklinks(rss3.account.address, 'test', 0)}`).replyOnce(200, backlinks0File);

test('Backlinks.getListFile', async () => {
    expect(await rss3.backlinks.getListFile(rss3.account.address, 'test', -1)).toEqual(backlinks1File);
    expect(await rss3.backlinks.getListFile(rss3.account.address, 'test', 0)).toEqual(backlinks0File);
});

test('Backlinks.getList', async () => {
    expect(await rss3.backlinks.getList(rss3.account.address, 'test')).toEqual([
        ...backlinks1File.list,
        ...backlinks0File.list,
    ]);
});
