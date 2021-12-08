import check from '../../src/utils/check';
import config from '../../src/config';
import { Buffer } from 'buffer';
import { utils } from '../../src/index';
import { ethers } from 'ethers';
import RSS3 from '../../src/index';

test('utils.check', () => {
    expect(utils.check).toBe(check);
});

test('check.valueLength', () => {
    expect(
        check.valueLength({
            test1: 'r',
            test2: 'r'.repeat(config.maxValueLength),
        }),
    ).toBe(true);
    expect(
        check.valueLength({
            test1: 'r',
            test2: 'r'.repeat(config.maxValueLength + 1),
        }),
    ).toBe(false);
});

test('check.fileSize', () => {
    const testObj = {
        t: 'r',
        signature: '0'.repeat(132),
    };
    const testObjLength = Buffer.byteLength(JSON.stringify(testObj));
    expect(
        check.fileSize(
            Object.assign(testObj, {
                t: 'r'.repeat(config.fileSizeLimit - testObjLength + 1),
            }),
        ),
    ).toBe(true);
    expect(
        check.fileSize(
            Object.assign(testObj, {
                t: 'r'.repeat(config.fileSizeLimit - testObjLength + 2),
            }),
        ),
    ).toBe(false);
});

test('check.fileSizeWithNew', () => {
    const testObj = {
        list: ['1'],
        t: 'r',
        signature: '0'.repeat(132),
    };
    const testObjLength = Buffer.byteLength(JSON.stringify(testObj));
    expect(
        check.fileSizeWithNew(
            Object.assign(testObj, {
                list: ['1'],
                t: 'r'.repeat(config.fileSizeLimit - testObjLength - 4 + 1),
            }),
            '2',
        ),
    ).toBe(true);
    expect(
        check.fileSizeWithNew(
            Object.assign(testObj, {
                list: ['1'],
                t: 'r'.repeat(config.fileSizeLimit - testObjLength - 4 + 2),
            }),
            '2',
        ),
    ).toBe(false);
});

test('check.signature without sign agent', async () => {
    const signer = ethers.Wallet.createRandom();
    const rss3 = new RSS3({
        endpoint: '',
        mnemonic: signer.mnemonic.phrase,
    });
    const data: any = {
        agent_id: 'test',
        test1: 'r',
    };
    await rss3.account.sign(data);

    expect(check.signature(data, signer.address)).toBe(true);
});

test('check.signature with sign agent', async () => {
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

    expect(check.signature(data, signer.address)).toBe(true);
});
