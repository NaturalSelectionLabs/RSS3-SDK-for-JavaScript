import Account from './account';
import Persona from './persona';
import File from './file';
import Profile from './profile';
import Items from './items';
import Item from './item';
import Links from './links';
import Link from './link';
import Backlinks from './backlinks';

export interface IOptionsMnemonic {
    endpoint: string;
    mnemonic?: string;
    mnemonicPath?: string;
}

export interface IOptionsPrivateKey {
    endpoint: string;
    privateKey: string;
}

export interface IOptionsSign {
    endpoint: string;
    address: string;
    sign: (data: string) => Promise<string>;
}

class RSS3 {
    options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign;
    account: Account;
    persona: Persona;
    file: File;
    profile: Profile;
    items: Items;
    item: Item;
    links: Links;
    link: Link;
    backlinks: Backlinks;

    constructor(options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign) {
        this.options = options;

        this.file = new File(this);
        this.account = new Account(this);
        this.persona = new Persona(this);
        this.profile = new Profile(this);
        this.items = new Items(this);
        this.item = new Item(this);
        this.links = new Links(this);
        this.link = new Link(this);
        this.backlinks = new Backlinks(this);
    }
}

export default RSS3;
