import Persona from './persona';
import File from './file';
import Profile from './profile';
import Items from './items';
import Item from './item';
import Links from './links';

interface IOptions {
    endpoint: string;
    privateKey?: string;
}

class RSS3 {
    options: IOptions;
    persona: Persona;
    file: File;
    profile: Profile;
    items: Items;
    item: Item;
    links: Links;

    constructor(options: IOptions) {
        this.options = options;

        this.file = new File(this);
        this.persona = new Persona(this);
        this.profile = new Profile(this);
        this.items = new Items(this);
        this.item = new Item(this);
        this.links = new Links(this);
    }
}

export default RSS3;
