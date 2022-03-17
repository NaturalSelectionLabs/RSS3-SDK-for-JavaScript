import Account from './account/index';
import Files from './files';
import Profile from './profile/index';
import Items from './items/index';
import Links from './links';
import Backlinks from './backlinks';
import Assets from './assets/index';

interface IOptions {
    endpoint: string;
}

export interface IOptionsMnemonic extends IOptions {
    account: {
        platform?: string;
        mnemonic: string;
        mnemonicPath?: string;
    };
}

export interface IOptionsPrivateKey extends IOptions {
    account: {
        platform?: string;
        privateKey: string;
    };
}

export interface IOptionsSign extends IOptions {
    account: {
        platform?: string;
        identity: string;
        sign: (message: string) => Promise<string>;
    };
}

export interface IOptionsNew extends IOptions {
    account?: {
        platform?: string;
    };
}

class RSS3 {
    options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign | IOptionsNew;
    account: Account;
    files: Files;
    profile: Profile;
    items: Items;
    links: Links;
    backlinks: Backlinks;
    assets: Assets;

    constructor(options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign | IOptionsNew) {
        this.options = options;

        if (!this.options.endpoint) {
            throw new Error('Option endpoint is required');
        }
        if (!this.options.account) {
            this.options.account = {};
        }
        if (!this.options.account.platform) {
            this.options.account.platform = 'ethereum';
        }

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
