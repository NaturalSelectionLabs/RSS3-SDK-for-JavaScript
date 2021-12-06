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
        list_custom: id.getCustomItems(rss3.account.address, 1),
    },
};
const items1File = {
    id: id.getCustomItems(rss3.account.address, 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: [
        {
            id: id.getCustomItem(rss3.account.address, 1),
            date_created: now,
            date_updated: now,
            title: 'Test1',
        },
    ],
    list_next: id.getCustomItems(rss3.account.address, 0),
};
const itemTest: any = {
    id: id.getCustomItem(rss3.account.address, 0),
    date_created: now,
    date_updated: now,
    title: 'Test0',
};
const items0File = {
    id: id.getCustomItems(rss3.account.address, 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: [itemTest],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getCustomItems(rss3.account.address, 1)}`).replyOnce(200, items1File);
mock.onGet(`test/${id.getCustomItems(rss3.account.address, 0)}`).replyOnce(200, items0File);

test('Items.custom.getListFile', async () => {
    expect(await rss3.items.custom.getListFile(rss3.account.address, -1)).toEqual(items1File);
    expect(await rss3.items.custom.getListFile(rss3.account.address, 0)).toEqual(items0File);
});

test('Items.custom.getList', async () => {
    expect(await rss3.items.custom.getList(rss3.account.address)).toEqual([...items1File.list, ...items0File.list]);
});

test('Items.custom.get', async () => {
    expect(await rss3.items.custom.get(itemTest.id)).toEqual(itemTest);
});

test('Items.custom.post', async () => {
    const file = JSON.parse(JSON.stringify(await rss3.items.custom.getListFile(rss3.account.address)));
    file.signature = '0'.repeat(132);
    const items = [];
    let i = 2;
    while (JSON.stringify(file).length < config.fileSizeLimit) {
        file.list.unshift({
            id: id.getCustomItem(rss3.account.address, i),
            date_created: now,
            date_updated: now,
            title: 'Test' + i,
        });
        items.push({
            title: 'Test' + i,
        });
    }
    for (let i = 0; i < items.length; i++) {
        await rss3.items.custom.post(items[i]);
    }
    expect((<any>await rss3.files.get()).items.list_custom).toBe(id.getCustomItems(rss3.account.address, 2));
    const lastList = await rss3.items.custom.getListFile(rss3.account.address);
    expect(lastList?.id).toBe(id.getCustomItems(rss3.account.address, 2));
    expect(lastList?.list?.length).toBe(1);

    const signer1 = ethers.Wallet.createRandom();
    mock.onGet(`test/${signer1.address}`).reply(404, {
        code: 5001,
    });
    const rss31 = new RSS3({
        endpoint: 'test',
        address: signer1.address,
        sign: signer1.signMessage.bind(signer1),
    });
    await rss31.items.custom.post({
        title: 'Test',
    });
    expect((<any>await rss31.files.get()).items.list_custom).toBe(id.getCustomItems(rss31.account.address, 0));
});

test('Items.custom.patch', async () => {
    itemTest.summary = 'TestSummary0';
    await rss3.items.custom.patch(itemTest);
    const result = (await rss3.items.custom.getListFile(rss3.account.address, 0))?.list?.[0];
    (<any>result).date_updated = itemTest.date_updated;
    expect(result).toEqual(itemTest);
});
