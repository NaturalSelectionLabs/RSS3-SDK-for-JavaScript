import Account from './account';
import Files from './files';
import Profile from './profile';
import Items from './items';
import Links from './links';
import Backlinks from './backlinks';
import Assets from './assets';
import { IOptionsMnemonic, IOptionsPrivateKey, IOptionsSign } from '../types';

class RSS3 {
    options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign;
    account: Account;
    files: Files;
    profile: Profile;
    items: Items;
    links: Links;
    backlinks: Backlinks;
    assets: Assets;

    constructor(options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign) {
        this.options = options;

        this.files = new Files(this);
        this.account = new Account(this);
        this.profile = new Profile(this);
        this.items = new Items(this);
        this.links = new Links(this);
        this.backlinks = new Backlinks(this);
        this.assets = new Assets(this);
    }
}

export default RSS3;
