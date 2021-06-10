import Main from './index';
import { equals } from 'typescript-is';
import utils from './utils';

interface IProfileIn {
    name?: string;
    avatar?: ThirdPartyAddress;
    bio?: string;
    tags?: string[];
}

class Profile {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(personaID: string = this.main.persona.id) {
        const file = <RSS3Index>await this.main.file.get(personaID);
        return file.profile;
    }

    async patch(profile: IProfileIn) {
        if (utils.check.valueLength(profile) && equals<IProfileIn>(profile)) {
            const file = <RSS3Index>await this.main.file.get(this.main.persona.id);
            file.profile = Object.assign({}, file.profile, profile);
            utils.accounts.sign(file.profile, this.main.persona.privateKey);
            utils.object.removeEmpty(file.profile, {
                obj: file,
                key: 'profile',
            });
            this.main.file.set(file);
            return file.profile;
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Profile;
