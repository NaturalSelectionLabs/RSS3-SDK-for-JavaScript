import RSS3 from '../src/index';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import config from '../src/config';
import { ethers } from 'ethers';
import object from '../src/utils/object';

const now = new Date().toISOString();
const mock = new MockAdapter(axios);

const signer = ethers.Wallet.createRandom();
const rss3 = new RSS3({
    endpoint: 'test',
    address: signer.address,
    sign: signer.signMessage.bind(signer),
});

const signer1 = ethers.Wallet.createRandom();
const account1 = {
    identity: signer1.address,
    platform: 'EVM+',
};

const account2: any = {
    identity: '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    platform: 'EVM+',
};

const file = {
    id: rss3.account.address,
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',

    profile: {
        accounts: [account1],
    },
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, file);

test('Accounts.get', async () => {
    expect(await rss3.profile.accounts.getList()).toEqual([account1]);
});

test('Accounts.post', async () => {
    await rss3.profile.accounts.post(account2);
    expect(await rss3.profile.accounts.getList()).toEqual([account1, account2]);
    expect(await rss3.files.get()).toEqual(
        expect.objectContaining({
            profile: {
                accounts: [account1, account2],
            },
        }),
    );
});

test('Accounts.patchTags', async () => {
    await rss3.profile.accounts.patchTags(account2, ['test']);
    account2.tags = ['test'];
    expect(await rss3.profile.accounts.getList()).toEqual([account1, account2]);
    expect(await rss3.files.get()).toEqual(
        expect.objectContaining({
            profile: {
                accounts: [account1, account2],
            },
        }),
    );
});

test('Accounts.getSigMessage', async () => {
    expect(await rss3.profile.accounts.getSigMessage(account2)).toEqual(
        object.stringifyObj({
            ...account2,
            address: rss3.account.address,
        }),
    );
});

test('Accounts.delete', async () => {
    await rss3.profile.accounts.delete({
        identity: account2.identity,
        platform: account2.platform,
    });
    expect(await rss3.profile.accounts.getList()).toEqual([account1]);
    expect(await rss3.files.get()).toEqual(
        expect.objectContaining({
            profile: {
                accounts: [account1],
            },
        }),
    );
});
