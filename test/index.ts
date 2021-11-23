import RSS3 from '../src/index';
import { ethers } from 'ethers';

const addressRegex = /^0x[0-9a-fA-F]{40}$/;
const privateKeyRegex = /^[0-9a-fA-F]{64}$/;
const mnemonicRegex = /^([0-9a-zA-Z]+\s){11}[0-9a-zA-Z]+$/;

test('RSS3 initialization without anything', () => {
    const rss3 = new RSS3({
        endpoint: '',
    });
    expect(rss3.account.address).toEqual(expect.stringMatching(addressRegex));
    expect(rss3.account.privateKey).toEqual(expect.stringMatching(privateKeyRegex));
    expect(rss3.account.mnemonic).toEqual(expect.stringMatching(mnemonicRegex));
});

test('RSS3 initialization with privateKey', () => {
    const signer = ethers.Wallet.createRandom();
    const rss3 = new RSS3({
        endpoint: '',
        privateKey: signer.privateKey,
    });
    expect(rss3.account.address).toEqual(expect.stringMatching(addressRegex));
    expect(rss3.account.privateKey).toEqual(expect.stringMatching(privateKeyRegex));
    expect(rss3.account.mnemonic).toEqual(undefined);
});

test('RSS3 initialization with mnemonic', () => {
    const signer = ethers.Wallet.createRandom();
    const rss3 = new RSS3({
        endpoint: '',
        mnemonic: signer.mnemonic.phrase,
    });
    expect(rss3.account.address).toEqual(expect.stringMatching(addressRegex));
    expect(rss3.account.privateKey).toEqual(expect.stringMatching(privateKeyRegex));
    expect(rss3.account.mnemonic).toEqual(expect.stringMatching(mnemonicRegex));
});

test('RSS3 initialization with address', () => {
    const signer = ethers.Wallet.createRandom();
    const rss3 = new RSS3({
        endpoint: '',
        address: signer.address,
        sign: signer.signMessage.bind(signer),
    });
    expect(rss3.account.address).toEqual(expect.stringMatching(addressRegex));
    expect(rss3.account.privateKey).toEqual(undefined);
    expect(rss3.account.mnemonic).toEqual(undefined);
});
