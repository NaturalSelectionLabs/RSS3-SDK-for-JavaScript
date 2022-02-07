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
    links: [
        {
            id: 'test',
            list: id.getLinks(rss3.account.address, 'test', 1),
        },
    ],
};
const links1File = {
    id: id.getLinks(rss3.account.address, 'test', 1),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: ['1', '2'],
    list_next: id.getLinks(rss3.account.address, 'test', 0),
};
const links0File = {
    id: id.getLinks(rss3.account.address, 'test', 0),
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',
    list: ['3'],
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, indexFile);
mock.onGet(`test/${id.getLinks(rss3.account.address, 'test', 1)}`).replyOnce(200, links1File);
mock.onGet(`test/${id.getLinks(rss3.account.address, 'test', 0)}`).replyOnce(200, links0File);
mock.onGet(`test/${id.getLinks(rss3.account.address, 'test1', 0)}`).reply(404, {
    code: 5001,
});

test('Links.getListFile', async () => {
    expect(await rss3.links.getListFile(rss3.account.address, 'test', -1)).toEqual(links1File);
    expect(await rss3.links.getListFile(rss3.account.address, 'test', 0)).toEqual(links0File);
});

test('Links.getList', async () => {
    expect(await rss3.links.getList(rss3.account.address, 'test')).toEqual([...links1File.list, ...links0File.list]);
});

test('Links.postList', async () => {
    await rss3.links.postList({
        id: 'test1',
        list: ['a', 'b'],
    });
    expect(await rss3.links.getList(rss3.account.address, 'test1')).toEqual(['a', 'b']);
    expect((<any>await rss3.files.get())?.links).toEqual([
        {
            id: 'test',
            list: id.getLinks(rss3.account.address, 'test', 1),
        },
        {
            id: 'test1',
            list: id.getLinks(rss3.account.address, 'test1', 0),
        },
    ]);
    expect((await rss3.links.getListFile(rss3.account.address, 'test1', -1))?.list).toEqual(['a', 'b']);
});

test('Links.deleteList', async () => {
    await rss3.links.deleteList('test1');
    expect(await rss3.links.getList(rss3.account.address, 'test1')).toEqual([]);
    expect((<any>await rss3.files.get())?.links).toEqual([
        {
            id: 'test',
            list: id.getLinks(rss3.account.address, 'test', 1),
        },
    ]);
});

test('Links.patchListTags', async () => {
    await rss3.links.patchListTags('test', ['test1']);
    expect((<any>await rss3.files.get())?.links).toEqual([
        {
            id: 'test',
            list: id.getLinks(rss3.account.address, 'test', 1),
            tags: ['test1'],
        },
    ]);
});

test('Links.post', async () => {
    const file = JSON.parse(JSON.stringify(await rss3.links.getListFile(rss3.account.address, 'test')));
    file.signature = '0'.repeat(132);
    const links = [];
    let i = 4;
    while (JSON.stringify(file).length < config.fileSizeLimit) {
        const newLink = i++ + '';
        file.list.unshift(newLink);
        links.push(newLink);
    }
    for (let i = 0; i < links.length; i++) {
        await rss3.links.post('test', links[i]);
    }
    expect((await rss3.links.getListFile(rss3.account.address, 'test', -1))?.id).toBe(
        id.getLinks(rss3.account.address, 'test', 2),
    );
    const lastList = await rss3.links.getListFile(rss3.account.address, 'test');
    expect(lastList?.id).toBe(id.getLinks(rss3.account.address, 'test', 2));
    expect(lastList?.list?.length).toBe(1);
});
