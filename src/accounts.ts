import Main from './index';
import type { RSS3Index, RSS3Account, RSS3AccountInput } from '../types/rss3';
import utils from './utils';
import { equals } from 'typescript-is';

class Accounts {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    getSigMessage(account: RSS3AccountInput) {
        return this.main.account.stringifyObj({
            platform: account.platform,
            identity: account.identity,
            address: this.main.account.address,
        });
    }

    async post(account: RSS3Account) {
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

    async patchTags(account: RSS3AccountInput, tags: string[]) {
        if (utils.check.valueLength(tags)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            const index = (file.accounts || []).findIndex(
                (ac) => ac.platform === account.platform && ac.identity === account.identity,
            );

            if (index !== -1) {
                file.accounts[index].tags = tags;
                this.main.files.set(file);
                return file.accounts[index];
            } else {
                return null;
            }
        } else {
            throw Error('Parameter error');
        }
    }

    async get(fileID: string = this.main.account.address) {
        const file = <RSS3Index>await this.main.files.get(fileID);
        return file.accounts || [];
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
