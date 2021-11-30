import RSS3 from '../../src/index';
import { ethers } from 'ethers';
import object from '../../src/utils/object';

test('Account.sign with singer', () => {
    const signer = ethers.Wallet.createRandom();
    const rss3 = new RSS3({
        endpoint: '',
        mnemonic: signer.mnemonic.phrase,
    });
    expect(
        rss3.account.sign({
            agent_id: 'test',
            test1: 'r',
        }),
    ).toEqual(
        signer.signMessage(
            object.stringifyObj({
                test1: 'r',
            }),
        ),
    );
});

test('Account.sign with custom sign', async () => {
    const signer = ethers.Wallet.createRandom();
    const rss3 = new RSS3({
        endpoint: '',
        address: signer.address,
        sign: (data) => Promise.resolve('sign' + data),
    });
    const data: any = {
        agent_id: 'test',
        test1: 'r',
    };
    await rss3.account.sign(data);
    expect(data.signature).toBe(
        'sign' +
            object.stringifyObj({
                test1: 'r',
            }),
    );
});
