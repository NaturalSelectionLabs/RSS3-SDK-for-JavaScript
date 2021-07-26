import Main from './index';
import { equals } from 'typescript-is';
import utils from './utils';
import type { RSS3Index, RSS3ProfileInput } from '../types/rss3';

class Profile {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(personaID: string = this.main.account.address) {
        const file = <RSS3Index>await this.main.files.get(personaID);
        return file.profile;
    }

    async patch(profile: RSS3ProfileInput) {
        if (utils.check.valueLength(profile) && equals<RSS3ProfileInput>(profile)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            file.profile = Object.assign({}, file.profile, profile);
            utils.object.removeEmpty(file.profile, {
                obj: file,
                key: 'profile',
            });
            if (file.profile) {
                await this.main.account.sign(file.profile);
            }
            this.main.files.set(file);
            return file.profile;
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Profile;
