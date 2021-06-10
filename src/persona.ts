import Main from './index';
import EthCrypto from 'eth-crypto';

class Persona {
    private main: Main;

    privateKey: string;
    id: string;

    constructor(main: Main) {
        this.main = main;

        if (main.options.privateKey) {
            this.privateKey = main.options.privateKey;
            this.id = EthCrypto.publicKey.toAddress(EthCrypto.publicKeyByPrivateKey(main.options.privateKey));
        } else {
            const keys = EthCrypto.createIdentity();
            this.privateKey = keys.privateKey;
            this.id = keys.address;
            this.main.file.new(this.id);
        }
    }

    sync() {
        this.main.file.sync();
    }
}

export default Persona;
