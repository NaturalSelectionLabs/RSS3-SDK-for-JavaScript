import Account from './account';
import Files from './files';
import Profile from './profile';
import Items from './items';
import Item from './item';
import Links from './links';
import Link from './link';
import Backlinks from './backlinks';
import Accounts from './accounts';
import Assets from './assets';
import { IOptionsMnemonic, IOptionsPrivateKey, IOptionsSign } from '../types';

class RSS3 {
    options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign;
    account: Account;
    files: Files;
    profile: Profile;
    items: Items;
    item: Item;
    links: Links;
    link: Link;
    backlinks: Backlinks;
    accounts: Accounts;
    assets: Assets;

    constructor(options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign) {
        this.options = options;

        this.files = new Files(this);
        this.account = new Account(this);
        this.profile = new Profile(this);
        this.items = new Items(this);
        this.item = new Item(this);
        this.links = new Links(this);
        this.link = new Link(this);
        this.backlinks = new Backlinks(this);
        this.accounts = new Accounts(this);
        this.assets = new Assets(this);
    }
}

export default RSS3;
