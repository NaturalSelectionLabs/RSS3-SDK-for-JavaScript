import Utils from './utils';
import Profiles from './profiles';
import Links from './links';
import Backlinks from './backlinks';
import Assets from './assets';
import Notes from './notes';

interface IOptions {
    endpoint: string;
    appName?: string;
}

class RSS3 {
    options: IOptions;

    utils: Utils;
    profiles: Profiles;
    links: Links;
    backlinks: Backlinks;
    notes: Notes;
    assets: Assets;

    constructor(options: IOptions) {
        this.options = options;

        this.options.endpoint = this.options.endpoint.replace(/\/$/, '');

        if (!this.options.endpoint) {
            throw new Error('Option endpoint is required');
        }

        this.utils = new Utils(this);
        this.profiles = new Profiles(this);
        this.links = new Links(this);
        this.backlinks = new Backlinks(this);
        this.assets = new Assets(this);
        this.notes = new Notes(this);
    }

    async get(uri: string) {
        return <LinksResponse>(await this.utils.requestURI(uri)).data;
    }
}

export default RSS3;
