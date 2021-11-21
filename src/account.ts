import type { AnyObject } from '../types/extend';
import Main from './index';
import { IOptionsMnemonic, IOptionsPrivateKey, IOptionsSign } from './index';
import { ethers } from 'ethers';
import utils from './utils';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

class Account {
    private main: Main;
    private signer: ethers.Wallet;
    private agentPrivateKey: Uint8Array;
    private agentPublickKey: Uint8Array;
    mnemonic: string | undefined;
    privateKey: string | undefined;
    address: string;

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
    }

    async sign(obj: AnyObject) {
        if (this.main.options.agentSign) {
            if (!this.agentPrivateKey || !this.agentPublickKey) {
                const agent = utils.storage.get(this.address);
                if (agent && agent.privateKey && agent.publicKey) {
                    this.agentPrivateKey = naclUtil.decodeBase64(agent.privateKey);
                    this.agentPublickKey = naclUtil.decodeBase64(agent.publicKey);
                } else {
                    const pair = nacl.sign.keyPair();
                    this.agentPrivateKey = pair.secretKey;
                    this.agentPublickKey = pair.publicKey;
                    utils.storage.set(this.address, {
                        publicKey: naclUtil.encodeBase64(this.agentPublickKey),
                        privateKey: naclUtil.encodeBase64(this.agentPrivateKey),
                    });
                }
            }

            obj.agent_id = naclUtil.encodeBase64(this.agentPublickKey);
            const agentMessage = `Hi, RSS3. I'm your agent ${obj.agent_id}`;
            if (!obj.agent_signature || ethers.utils.verifyMessage(agentMessage, obj.signature) !== obj.id) {
                if (this.signer) {
                    obj.signature = await this.signer.signMessage(agentMessage);
                } else if ((<IOptionsSign>this.main.options).sign) {
                    obj.signature = await (<IOptionsSign>this.main.options).sign(agentMessage);
                }
            }
            const signature = nacl.sign.detached(
                new TextEncoder().encode(utils.object.stringifyObj(obj)),
                this.agentPrivateKey,
            );
            obj.agent_signature = naclUtil.encodeBase64(signature);
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
                    ethers.utils.verifyMessage(`Hi, RSS3. I'm your agent ${obj.agent_id}`, obj.signature) === obj.id &&
                    nacl.sign.detached.verify(
                        new TextEncoder().encode(utils.object.stringifyObj(obj)),
                        naclUtil.decodeBase64(obj.agent_signature),
                        naclUtil.decodeBase64(obj.agent_id),
                    )
                );
            } else {
                return ethers.utils.verifyMessage(utils.object.stringifyObj(obj), obj.signature) === address;
            }
        }
    }
}

export default Account;
