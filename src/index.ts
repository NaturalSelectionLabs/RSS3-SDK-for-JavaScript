import { equals } from 'typescript-is';
import config from './config';
import utils from './utils';

import Persona from './persona';
import File from './file';

interface IOptions {
    endpoint: string;
    privateKey?: string;
}

interface IItemIn {
    id?: string;
    authors?: RSS3ID[];
    title?: string;
    summary?: string;
    tags?: string[];

    type?: string;
    upstream?: RSS3ItemID;

    contents?: {
        address: ThirdPartyAddress;
        mime_type: string;
        name?: string;
        tags?: string[];
        size_in_bytes?: string;
        duration_in_seconds?: string;
    }[];
}
interface IProfileIn {
    name?: string;
    avatar?: ThirdPartyAddress;
    bio?: string;
    tags?: string[];
}

class RSS3 {
    options: IOptions;
    persona: Persona;
    file: File;

    constructor(options: IOptions) {
        this.options = options;

        this.file = new File(this);
        this.persona = new Persona(this);
    }

    async profilePatch(profile: IProfileIn) {
        if (utils.check.valueLength(profile) && equals<IProfileIn>(profile)) {
            const file = <RSS3Index>await this.file.get(this.persona.id);
            file.profile = Object.assign({}, file.profile, profile);
            utils.signature.sign(file.profile, this.persona.privateKey);
            utils.object.removeEmpty(file.profile, {
                obj: file,
                key: 'profile',
            });
            this.file.setDirty(this.persona.id);
            return file.profile;
        } else {
            throw Error('Parameter error');
        }
    }

    async itemPost(itemIn: IItemIn) {
        if (utils.check.valueLength(itemIn) && equals<IItemIn>(itemIn)) {
            const file = <RSS3Index>await this.file.get(this.persona.id);
            if (!file.items) {
                file.items = [];
            }

            const id = file.items[0] ? utils.id.parse(file.items[0].id).index + 1 : 0;

            const nowDate = new Date().toISOString();
            const item: RSS3Item = Object.assign(
                {
                    authors: [this.persona.id],
                },
                itemIn,
                {
                    id: `${this.persona.id}-item-${id}`,
                    date_published: nowDate,
                    date_modified: nowDate,
                    signature: '',
                },
            );
            utils.object.removeEmpty(item);
            utils.signature.sign(item, this.persona.privateKey);

            file.items.unshift(item);

            if (file.items.length > config.itemPageSize) {
                const newList = file.items.slice(1);
                const newID =
                    this.persona.id + '-items-' + (file.items_next ? utils.id.parse(file.items_next).index + 1 : 0);
                const newFile = this.file.new(newID);
                newFile.items = newList;
                newFile.items_next = file.items_next;

                file.items = file.items.slice(0, 1);
                file.items_next = newID;
            }

            file.date_updated = nowDate;
            this.file.setDirty(this.persona.id);

            return item;
        } else {
            return null;
        }
    }

    async itemPatch(itemIn: IItemIn) {
        if (utils.check.valueLength(itemIn) && itemIn.id && equals<IItemIn>(itemIn)) {
            // try index file first
            let fileID = this.persona.id;
            let file = await this.file.get(fileID);
            let index = file.items.findIndex((item) => item.id === itemIn.id);
            if (index === -1) {
                const parsed = utils.id.parse(itemIn.id);
                let fileID = this.persona.id + '-items-' + Math.ceil(parsed.index / config.itemPageSize);
                file = await this.file.get(fileID);
                index = file.items.findIndex((item) => item.id === itemIn.id);
            }
            if (index !== -1) {
                const nowDate = new Date().toISOString();
                file.items[index] = Object.assign(file.items[index], itemIn, {
                    date_modified: nowDate,
                });
                utils.object.removeEmpty(file.items[index]);
                utils.signature.sign(file.items[index], this.persona.privateKey);
                file.date_updated = nowDate;

                this.file.setDirty(fileID);
                return file.items[index];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    linksPost() {
        // TODO
    }

    linksPatch() {
        // TODO
    }
}

export default RSS3;
