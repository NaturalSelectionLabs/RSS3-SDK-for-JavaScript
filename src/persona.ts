import Main from './index';
import utils from './utils';
import Web3 from 'web3';
import type { Eth } from 'web3-eth';
import type { Personal } from 'web3-eth-personal';

declare global {
    interface Window {
        ethereum?: any;
    }
}

interface MetaMaskPersonal extends Personal {
    sign(
        dataToSign: string,
        address: string,
        password?: string,
        callback?: (error: Error, signature: string) => void,
    ): Promise<string>;
}
interface MetaMaskEth extends Eth {
    personal: MetaMaskPersonal;
}
interface MetaMaskWeb3 extends Web3 {
    eth: MetaMaskEth;
}

class Persona {
    private main: Main;

    privateKey: string;
    id: string;
    metaMaskWeb3: MetaMaskWeb3;

    constructor(main: Main) {
        this.main = main;

        if (main.options.privateKey) {
            this.privateKey = main.options.privateKey;
            this.id = utils.accounts.privateKeyToAddress(main.options.privateKey);
        } else if (main.options.provider === 'MetaMask') {
            this.metaMaskWeb3 = new Web3((<any>window).ethereum);
            try {
                window.ethereum
                    .request({
                        method: 'eth_requestAccounts',
                    })
                    .then((accounts: string) => {
                        this.id = this.metaMaskWeb3.utils.toChecksumAddress(accounts[0]);
                    });
            } catch (e) {
                console.error(e);
            }
        } else {
            const keys = utils.accounts.create();
            this.privateKey = keys.privateKey.slice(2);
            this.id = keys.address;
            this.main.file.new(this.id);
        }
    }

    sync() {
        return this.main.file.sync();
    }

    raw(fileID: string = this.id) {
        return this.main.file.get(fileID);
    }
}

export default Persona;
