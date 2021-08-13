import Main from './index';
import type { RSS3Index, RSS3Account } from '../types/rss3';
import utils from './utils';
import { equals } from 'typescript-is';

class Accounts {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async put(account: RSS3Account) {
        if (utils.check.valueLength(account) && equals<RSS3Account>(account)) {
            this.identityFormat(account);
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            if (!file.accounts) {
                file.accounts = [];
            }
            if (!file.accounts.find((ac) => ac.platform === account.platform && ac.identity === account.identity)) {
                utils.object.removeEmpty(account);
                file.accounts.push(account);
            } else {
                throw Error('Account already exists');
            }
            this.main.files.set(file);
            return account;
        } else {
            throw Error('Parameter error');
        }
    }

    async delete(account: { platform: string; identity: string }) {
        this.identityFormat(account);
        const file = <RSS3Index>await this.main.files.get(this.main.account.address);
        const acIndex = (file.accounts || []).findIndex(
            (ac) => ac.platform === account.platform && ac.identity === account.identity,
        );
        if (acIndex !== -1) {
            file.accounts.splice(acIndex, 1);
            if (file.accounts.length === 0) {
                delete file.accounts;
            }
            await this.main.files.set(file);
            return account;
        } else {
            throw Error('Account does not exist');
        }
    }

    private identityFormat(account: { platform: string; identity: string }) {
        if (account.platform === 'Ronin') {
            if (account.identity.startsWith('ronin:')) {
                account.identity = 'ronin:' + account.identity;
            }
        }
    }
}

export default Accounts;
