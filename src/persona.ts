import Main from './index';
import utils from './utils';
import type { IOptionsPrivateKey, IOptionsSign } from './index';

declare global {
    interface Window {
        ethereum?: any;
    }
}

class Persona {
    private main: Main;

    privateKey: string;
    id: string;

    constructor(main: Main) {
        this.main = main;

        if ((<IOptionsPrivateKey>main.options).privateKey) {
            this.privateKey = (<IOptionsPrivateKey>main.options).privateKey;
            this.id = utils.accounts.privateKeyToAddress((<IOptionsPrivateKey>main.options).privateKey);
        } else if ((<IOptionsSign>main.options).id && (<IOptionsSign>main.options).sign) {
            this.id = (<IOptionsSign>main.options).id;
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
