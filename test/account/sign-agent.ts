import RSS3 from '../../src/index';
import { ethers } from 'ethers';
import object from '../../src/utils/object';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

test('Account.sign with sign agent', async () => {
    const signer = ethers.Wallet.createRandom();
    const storage: any = {};
    const rss3 = new RSS3({
        endpoint: '',
        mnemonic: signer.mnemonic.phrase,
        agentSign: true,
        agentStorage: {
            set: (key, value) => {
                storage[key] = value;
                return Promise.resolve();
            },
            get: (key) => Promise.resolve(storage[key]),
        },
    });
    const data: any = {
        agent_id: 'test',
        test1: 'r',
    };
    await rss3.account.sign(data);

    expect(ethers.utils.verifyMessage(`Hi, RSS3. I'm your agent ${data.agent_id}`, data.signature)).toBe(
        signer.address,
    );

    expect(
        nacl.sign.detached.verify(
            new TextEncoder().encode(object.stringifyObj(data)),
            naclUtil.decodeBase64(data.agent_signature),
            naclUtil.decodeBase64(data.agent_id),
        ),
    ).toBe(true);

    const firstData = JSON.parse(JSON.stringify(data));
    data.test2 = 's';
    await rss3.account.sign(data);
    expect(data.signature).toBe(firstData.signature);
    expect(data.agent_id).toBe(firstData.agent_id);
    expect(data.agent_signature).not.toBe(firstData.agent_signature);
});

test('Account.check with sign agent', async () => {
    const signer = ethers.Wallet.createRandom();
    const storage: any = {};
    const rss3 = new RSS3({
        endpoint: '',
        mnemonic: signer.mnemonic.phrase,
        agentSign: true,
        agentStorage: {
            set: (key, value) => {
                storage[key] = value;
                return Promise.resolve();
            },
            get: (key) => Promise.resolve(storage[key]),
        },
    });
    const data: any = {
        agent_id: 'test',
        test1: 'r',
    };
    await rss3.account.sign(data);

    expect(rss3.account.check(data, signer.address)).toBe(true);
});
