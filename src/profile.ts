import Main from './index';
import { equals } from 'typescript-is';
import utils from './utils';
import type { RSS3Index, RSS3ProfileInput } from '../types/rss3';

class Profile {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(personaID: string = this.main.persona.id) {
        const file = <RSS3Index>await this.main.file.get(personaID);
        return file.profile;
    }

    async patch(profile: RSS3ProfileInput) {
        if (utils.check.valueLength(profile) && equals<RSS3ProfileInput>(profile)) {
            const file = <RSS3Index>await this.main.file.get(this.main.persona.id);
            file.profile = Object.assign({}, file.profile, profile);
            utils.object.removeEmpty(file.profile, {
                obj: file,
                key: 'profile',
            });
            if (file.profile) {
                await utils.accounts.sign(file.profile, this.main.persona);
            }
            this.main.file.set(file);
            return file.profile;
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Profile;
