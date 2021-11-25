import RSS3 from '../../src/index';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import config from '../../src/config';
import { ethers } from 'ethers';

const now = new Date().toISOString();
const mock = new MockAdapter(axios);

const signer = ethers.Wallet.createRandom();
const rss3 = new RSS3({
    endpoint: 'test',
    address: signer.address,
    sign: signer.signMessage.bind(signer),
});

const file = {
    id: rss3.account.address,
    version: config.version,
    date_created: now,
    date_updated: now,
    signature: '',

    profile: {
        name: 'test',
    },
};
mock.onGet(`test/${rss3.account.address}`).replyOnce(200, file);

test('Profile.get', async () => {
    expect(await rss3.profile.get()).toEqual({
        name: 'test',
    });
});

test('Profile.get and Profile.patch', async () => {
    const profile2In = {
        name: '',
        avatar: ['test1'],
        bio: 'test2',
    };
    const profile2 = {
        avatar: ['test1'],
        bio: 'test2',
    };
    await rss3.profile.patch(profile2In);
    expect(await rss3.profile.get()).toEqual(profile2);
    expect(await rss3.files.get()).toEqual(
        expect.objectContaining({
            profile: profile2,
        }),
    );
});
