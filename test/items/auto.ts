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
    items: {
        list_auto: id.getAutoItems(rss3.account.address, 1),
    },
};
const items1File = {
    id: id.getAutoItems(rss3.account.address, 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: [
        {
            id: id.getAutoItem(rss3.account.address, 1),
            date_created: now,
            date_updated: now,
            target: {
                field: 'test1',
                action: {
                    type: 'add',
                    payload: 'test',
                    proof: 'test',
                },
            },
        },
    ],
    list_next: id.getAutoItems(rss3.account.address, 0),
};
const itemTest: any = {
    id: id.getAutoItem(rss3.account.address, 0),
    date_created: now,
    date_updated: now,
    target: {
        field: 'test0',
        action: {
            type: 'add',
            payload: 'test',
            proof: 'test',
        },
    },
};
const items0File = {
    id: id.getAutoItems(rss3.account.address, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: [itemTest],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getAutoItems(rss3.account.address, 1)}`).replyOnce(200, items1File);
mock.onGet(`test/${id.getAutoItems(rss3.account.address, 0)}`).replyOnce(200, items0File);

test('Items.auto.getListFile', async () => {
    expect(await rss3.items.auto.getListFile(rss3.account.address, -1)).toEqual(items1File);
    expect(await rss3.items.auto.getListFile(rss3.account.address, 0)).toEqual(items0File);
});

test('Items.auto.getList', async () => {
    expect(await rss3.items.auto.getList(rss3.account.address)).toEqual([...items1File.list, ...items0File.list]);
});

test('Items.auto.get', async () => {
    expect(await rss3.items.auto.get(itemTest.id)).toEqual(itemTest);
});
