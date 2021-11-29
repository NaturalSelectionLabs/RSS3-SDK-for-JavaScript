import Main from '../index';
import utils from '../utils';
import { equals } from 'typescript-is';

class Accounts {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    private async getPosition(persona: string, id: string) {
        const file = <RSS3Index>await this.main.files.get(persona);
        const index = (file.profile?.accounts || []).findIndex((ac) => ac.id === id);
        return {
            file,
            index,
        };
    }

    async getSigMessage(account: RSS3Account) {
        return utils.object.stringifyObj({
            ...account,
            address: this.main.account.address,
        });
    }

    async post(account: RSS3Account) {
        if (utils.check.valueLength(account) && equals<RSS3Account>(account)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            if (!file.profile) {
                file.profile = {};
            }
            if (!file.profile.accounts) {
                file.profile.accounts = [];
            }
            if (!file.profile.accounts.find((ac) => ac.id === account.id)) {
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

    async patchTags(id: string, tags: string[]) {
        if (utils.check.valueLength(tags)) {
            const { file, index } = await this.getPosition(this.main.account.address, id);

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

    async getList(persona: string = this.main.account.address) {
        const file = <RSS3Index>await this.main.files.get(persona);
        return file.profile?.accounts || [];
    }

    async delete(id: string) {
        const { file, index } = await this.getPosition(this.main.account.address, id);
        if (index !== -1) {
            file.profile!.accounts!.splice(index, 1);
            await this.main.files.set(file);
            return id;
        } else {
            throw Error('Account does not exist');
        }
    }
}

export default Accounts;
