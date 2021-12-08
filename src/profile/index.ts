import Main from '../index';
import { equals } from 'typescript-is';
import utils from '../utils';
import Accounts from './accounts';
import axois from 'axios';

class Profile {
    private main: Main;

    accounts: Accounts;

    constructor(main: Main) {
        this.main = main;
        this.accounts = new Accounts(this.main);
    }

    async get(personaID: string = this.main.account.address) {
        const file = <RSS3Index>await this.main.files.get(personaID);
        return file.profile || {};
    }

    async patch(profile: RSS3Profile) {
        if (utils.check.valueLength(profile) && equals<RSS3Profile>(profile)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            file.profile = Object.assign({}, file.profile, profile);
            utils.object.removeEmpty(file.profile, {
                obj: file,
                key: 'profile',
            });
            this.main.files.set(file);
            return file.profile;
        } else {
            throw Error('Parameter error');
        }
    }

    async getList(personas: string[]) {
        const response = await axois({
            method: 'get',
            url: `${this.main.options.endpoint}/profile/list`,
            params: {
                personas: personas.join(','),
            },
        });
        return <(RSS3Profile & { persona: string })[]>response.data.data;
    }
}

export default Profile;
