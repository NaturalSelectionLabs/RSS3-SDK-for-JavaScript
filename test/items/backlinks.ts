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
        auto: id.getAutoItems(rss3.account.address, 0),
    },
};
const itemTest: any = {
    id: id.getAutoItem(rss3.account.address, 0),
    date_created: now,
    date_updated: now,
    title: 'Test0',

    backlinks: [
        {
            auto: true,
            id: 'like',
            list: id.getItemBacklinks(rss3.account.address, 'like', 1, 0),
        },
        {
            auto: true,
            id: 'comment',
            list: id.getItemBacklinks(rss3.account.address, 'comment', 1, 0),
        },
    ],
};
const comment1Test = {
    id: id.getItemBacklinks(rss3.account.address, 'comment', 1, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: ['2', '1'],
    list_next: id.getItemBacklinks(rss3.account.address, 'comment', 0, 0),
};
const comment0Test = {
    id: id.getItemBacklinks(rss3.account.address, 'comment', 0, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    auto: true,
    list: ['0'],
};
const items0File = {
    id: id.getAutoItems(rss3.account.address, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: [itemTest],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getAutoItems(rss3.account.address, 0)}`).replyOnce(200, items0File);
mock.onGet(`test/${id.getItemBacklinks(rss3.account.address, 'comment', 1, 0)}`).replyOnce(200, comment1Test);
mock.onGet(`test/${id.getItemBacklinks(rss3.account.address, 'comment', 0, 0)}`).replyOnce(200, comment0Test);

test('Items.backlinks.getListFile', async () => {
    expect(await rss3.items.auto.backlinks.getListFile(itemTest.id, 'comment', -1)).toEqual(comment1Test);
    expect(await rss3.items.auto.backlinks.getListFile(itemTest.id, 'comment', 0)).toEqual(comment0Test);
});

test('Items.auto.getList', async () => {
    expect(await rss3.items.auto.backlinks.getList(itemTest.id, 'comment')).toEqual([
        ...comment1Test.list,
        ...comment0Test.list,
    ]);
});
