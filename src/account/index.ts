import type { AnyObject } from '../../types/extend';
import Main from '../index';
import { IOptionsMnemonic, IOptionsPrivateKey, IOptionsSign } from './../index';
import { ethers } from 'ethers';
import utils from './../utils';
import SignAgent from './sign-agent';
import AsyncLock from 'async-lock';

class Account {
    private main: Main;
    private signer: ethers.Wallet;
    private lock: AsyncLock;
    private signCache: Map<string, string>;

    mnemonic: string | undefined;
    privateKey: string | undefined;
    address: string;
    signAgent: SignAgent;

    constructor(main: Main) {
        this.main = main;
        this.lock = new AsyncLock();
        this.signCache = new Map();

        if ((<IOptionsMnemonic>main.options).mnemonic) {
            // mnemonic
            this.signer = ethers.Wallet.fromMnemonic((<IOptionsMnemonic>main.options).mnemonic!);
        } else if ((<IOptionsPrivateKey>main.options).privateKey) {
            // privateKey
            this.signer = new ethers.Wallet((<IOptionsPrivateKey>main.options).privateKey);
        } else if ((<IOptionsSign>main.options).address && (<IOptionsSign>main.options).sign) {
            // custom sign
            this.address = (<IOptionsSign>main.options).address;
        } else {
            // create new
            this.signer = ethers.Wallet.createRandom({
                path: (<IOptionsMnemonic>main.options).mnemonicPath,
            });
            this.main.files.new(this.signer.address);
        }
        if (this.signer) {
            this.mnemonic = this.signer.mnemonic?.phrase;
            this.privateKey = this.signer.privateKey.slice(2);
            this.address = this.signer.address;
        }
    }

    async sign(obj: AnyObject) {
        if (this.main.options.agentSign) {
            if (!this.signAgent) {
                this.signAgent = new SignAgent(this.main);
            }
            obj.agent_id = await this.signAgent.getAddress();
            const agentMessage = this.signAgent.getMessage(obj.agent_id);
            if (
                !obj.agent_signature ||
                ethers.utils.verifyMessage(agentMessage, obj.signature) !== utils.id.parse(obj.id).persona
            ) {
                if (this.signer) {
                    obj.signature = await this.signer.signMessage(agentMessage);
                } else if ((<IOptionsSign>this.main.options).sign) {
                    obj.signature = await this.outerSign(agentMessage);
                }
            }
            obj.agent_signature = await this.signAgent.sign(obj);
        } else {
            delete obj.agent_signature;
            delete obj.agent_id;
            const agentMessage = utils.object.stringifyObj(obj);
            if (this.signer) {
                obj.signature = await this.signer.signMessage(agentMessage);
            } else if ((<IOptionsSign>this.main.options).sign) {
                obj.signature = await this.outerSign(agentMessage);
            }
        }
    }

    private outerSign(agentMessage: string) {
        return new Promise(async (resolve, reject) => {
            this.lock.acquire(agentMessage, async () => {
                let signature;
                if (!this.signCache.has(agentMessage)) {
                    signature = await (<IOptionsSign>this.main.options).sign(agentMessage);
                    this.signCache.set(agentMessage, signature);
                } else {
                    signature = this.signCache.get(agentMessage);
                }
                resolve(signature);
            });
        });
    }
}

export default Account;
