import type { AnyObject } from '../../types/extend';
import Main from '../index';
import utils from '../utils';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import Cookies from 'js-cookie';
import md5 from 'crypto-js/md5';
import config from '../config';
import { Buffer } from 'buffer';

interface IStorageData {
    privateKey: string;
    publicKey: string;
}

class SignAgent {
    private main: Main;
    private privateKey: Uint8Array;
    private publickKey: Uint8Array;
    private initPromise: Promise<void | IStorageData>;

    address: string;

    constructor(main: Main) {
        this.main = main;

        this.initPromise = this.get().then((agent) => {
            if (agent && agent.privateKey && agent.publicKey) {
                this.privateKey = naclUtil.decodeBase64(agent.privateKey);
                this.publickKey = naclUtil.decodeBase64(agent.publicKey);
            } else {
                const pair = nacl.sign.keyPair();
                this.privateKey = pair.secretKey;
                this.publickKey = pair.publicKey;
                this.set({
                    publicKey: naclUtil.encodeBase64(this.publickKey),
                    privateKey: naclUtil.encodeBase64(this.privateKey),
                });
            }
            this.address = naclUtil.encodeBase64(this.publickKey);
        });
    }

    getAddress() {
        return this.initPromise.then(() => {
            return this.address;
        });
    }

    getMessage(address: string) {
        return `Hi, RSS3. I'm your agent ${address}`;
    }

    async sign(obj: AnyObject) {
        return this.initPromise.then(() => {
            const signature = nacl.sign.detached(
                new TextEncoder().encode(utils.object.stringifyObj(obj)),
                this.privateKey,
            );
            return naclUtil.encodeBase64(signature);
        });
    }

    private getKey(address: string) {
        return 'RSS3.0.' + md5(address);
    }

    private set(value: IStorageData) {
        const key = this.getKey(this.main.account.address);
        const va = Buffer.from(JSON.stringify(value), 'base64').toString();
        if (this.main.options.agentStorage) {
            this.main.options.agentStorage.set(key, va);
        } else {
            if (window) {
                let currentRootDomain;
                const split = window.location.hostname.split('.');
                if (split.length > 2) {
                    currentRootDomain = split[split.length - 2] + '.' + split[split.length - 1];
                } else {
                    currentRootDomain = window.location.hostname;
                }
                Cookies.set(key, va, {
                    domain: '.' + currentRootDomain,
                    secure: true,
                    sameSite: 'Strict',
                    expires: config.storageExpires,
                });
            }
        }
    }

    private async get() {
        try {
            let data;
            if (this.main.options.agentStorage) {
                data = await this.main.options.agentStorage?.get(this.getKey(this.main.account.address));
            } else {
                data = Cookies.get(this.getKey(this.main.account.address));
            }
            if (data) {
                const result = <IStorageData>JSON.parse(Buffer.from(data).toString('base64'));
                this.set(result);
                return result;
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }
}

export default SignAgent;
