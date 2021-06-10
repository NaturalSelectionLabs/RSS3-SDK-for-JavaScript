import Main from './index';
import utils from './utils';

class Persona {
    private main: Main;

    privateKey: string;
    id: string;

    constructor(main: Main) {
        this.main = main;

        if (main.options.privateKey) {
            this.privateKey = main.options.privateKey;
            this.id = utils.accounts.privateKeyToAddress(main.options.privateKey);
        } else {
            const keys = utils.accounts.create();
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
