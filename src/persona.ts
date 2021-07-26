import Main from './index';
import utils from './utils';
import type { IOptionsMnemonic, IOptionsPrivateKey, IOptionsSign } from './index';

declare global {
    interface Window {
        ethereum?: any;
    }
}

class Persona {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    sync() {
        return this.main.file.sync();
    }

    raw(fileID: string = this.main.account.address) {
        return this.main.file.get(fileID);
    }
}

export default Persona;
