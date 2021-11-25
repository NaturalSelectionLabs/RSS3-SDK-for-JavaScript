import type { AnyObject } from '../../types/extend';
import Main from '../index';
import { IOptionsMnemonic, IOptionsPrivateKey, IOptionsSign } from './../index';
import { ethers } from 'ethers';
import utils from './../utils';
import SignAgent from './sign-agent';

class Account {
    private main: Main;
    private signer: ethers.Wallet;
    mnemonic: string | undefined;
    privateKey: string | undefined;
    address: string;
    signAgent: SignAgent;

    constructor(main: Main) {
        this.main = main;

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
        if (this.main.options.agentSign) {
            this.signAgent = new SignAgent(main);
        }
    }

    async sign(obj: AnyObject) {
        if (this.main.options.agentSign) {
            obj.agent_id = await this.signAgent.getAddress();
            const agentMessage = this.signAgent.getMessage(obj.agent_id);
            if (!obj.agent_signature || ethers.utils.verifyMessage(agentMessage, obj.signature) !== obj.id) {
                if (this.signer) {
                    obj.signature = await this.signer.signMessage(agentMessage);
                } else if ((<IOptionsSign>this.main.options).sign) {
                    obj.signature = await (<IOptionsSign>this.main.options).sign(agentMessage);
                }
            }
            obj.agent_signature = await this.signAgent.sign(obj);
        } else {
            delete obj.agent_signature;
            delete obj.agent_id;
            if (this.signer) {
                obj.signature = await this.signer.signMessage(utils.object.stringifyObj(obj));
            } else if ((<IOptionsSign>this.main.options).sign) {
                obj.signature = await (<IOptionsSign>this.main.options).sign(utils.object.stringifyObj(obj));
            }
        }
    }

    check(obj: AnyObject, address = this.address) {
        if (!obj.signature) {
            return false;
        } else {
            if (obj.agent_signature && obj.agent_id) {
                return (
                    ethers.utils.verifyMessage(this.signAgent.getMessage(obj.agent_id), obj.signature) === address &&
                    this.signAgent.check(obj)
                );
            } else {
                return ethers.utils.verifyMessage(utils.object.stringifyObj(obj), obj.signature) === address;
            }
        }
    }
}

export default Account;
