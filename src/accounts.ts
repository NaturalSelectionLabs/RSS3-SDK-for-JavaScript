import Main from './index';
import utils from './utils';
import { equals } from 'typescript-is';

class Accounts {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    private async getPosition(persona: string, account: RSS3Account) {
        const file = <RSS3Index>await this.main.files.get(persona);
        const index = (file.profile?.accounts || []).findIndex(
            (ac) => ac.platform === account.platform && ac.identity === account.identity,
        );
        return {
            file,
            index,
        };
    }

    getSigMessage(account: RSS3Account) {
        return utils.object.stringifyObj({
            platform: account.platform,
            identity: account.identity,
            address: this.main.account.address,
        });
    }

    async post(account: RSS3Account) {
        if (utils.check.valueLength(account) && equals<RSS3Account>(account)) {
            this.identityFormat(account);
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            if (!file.profile) {
                file.profile = {};
            }
            if (!file.profile.accounts) {
                file.profile.accounts = [];
            }
            if (
                !file.profile.accounts.find(
                    (ac) => ac.platform === account.platform && ac.identity === account.identity,
                )
            ) {
                file.profile.accounts.push(account);
                this.main.files.set(file);
                return account;
            } else {
                throw Error('Account already exists');
            }
        } else {
            throw Error('Parameter error');
        }
    }

    async patchTags(account: RSS3Account, tags: string[]) {
        if (utils.check.valueLength(tags)) {
            const { file, index } = await this.getPosition(this.main.account.address, account);

            if (index !== -1) {
                file.profile!.accounts![index].tags = tags;
                this.main.files.set(file);
                return file.profile!.accounts![index];
            } else {
                throw Error('Account does not exist');
            }
        } else {
            throw Error('Parameter error');
        }
    }

    async getList(fileID: string = this.main.account.address) {
        const file = <RSS3Index>await this.main.files.get(fileID);
        return file.profile?.accounts || [];
    }

    async delete(account: { platform: string; identity: string }) {
        this.identityFormat(account);
        const { file, index } = await this.getPosition(this.main.account.address, account);
        if (index !== -1) {
            file.profile!.accounts!.splice(index, 1);
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
