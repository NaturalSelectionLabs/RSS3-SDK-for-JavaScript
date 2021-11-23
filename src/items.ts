import Main from './index';
import utils from './utils';
import { equals } from 'typescript-is';
import config from './config';

interface ItemPost {
    tags?: string[];
    authors?: RSS3ID[];
    title?: string;
    summary?: string;

    link?: {
        type: string;
        target: RSS3ItemID;
    };

    contents?: {
        tags?: string[];
        address: ThirdPartyAddress;
        mime_type: string;
        name?: string;
        size_in_bytes?: string;
        duration_in_seconds?: string;
    }[];
}

interface ItemPatch extends ItemPost {
    id: RSS3ItemID;
}

class Items {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async getListFile(persona: string, index = -1) {
        if (index < 0) {
            const indexFile = <RSS3Index>await this.main.files.get(persona);
            if (indexFile.items) {
                const parsed = utils.id.parse(indexFile.items);
                index = parsed.index + index + 1;
                return <RSS3ItemsList>await this.main.files.get(utils.id.getItems(persona, index));
            } else {
                return null;
            }
        } else {
            return <RSS3ItemsList>await this.main.files.get(utils.id.getItems(persona, index));
        }
    }

    async getList(persona: string, breakpoint?: (file: RSS3ItemsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.items) {
            return <RSS3Item[]>await this.main.files.getAll(indexFile.items, (file) => {
                return breakpoint?.(<RSS3ItemsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private async getPosition(itemID: string) {
        let result: {
            file: RSS3ItemsList | null;
            index: number;
        } = {
            file: null,
            index: -1,
        };
        this.getList(this.main.account.address, (file) => {
            if (!file.list) {
                return false;
            }
            const index = file.list.findIndex((item) => item.id === itemID);
            if (index !== -1) {
                result = {
                    file,
                    index,
                };
                return true;
            } else {
                return false;
            }
        });
        return result;
    }

    async get(itemID: string) {
        const position = await this.getPosition(itemID);
        if (position.index !== -1) {
            return position.file!.list![position.index];
        } else {
            return null;
        }
    }

    async post(itemIn: ItemPost) {
        if (utils.check.valueLength(itemIn) && equals<ItemPost>(itemIn)) {
            let file = await this.getListFile(this.main.account.address, -1);
            if (!file) {
                const newID = utils.id.getItems(this.main.account.address, 0);
                file = <RSS3ItemsList>this.main.files.new(newID);
            }
            if (!file.list) {
                file.list = [];
            }

            const id = file.list[0] ? utils.id.parse(file.list[0].id).index + 1 : 0;

            const nowDate = new Date().toISOString();
            const item: RSS3Item = Object.assign(
                {
                    date_published: nowDate,
                },
                itemIn,
                {
                    id: utils.id.getItem(this.main.account.address, id),
                    date_modified: nowDate,
                },
            );

            if (!utils.check.fileSizeWithNew(file, item)) {
                const newID = utils.id.getItems(this.main.account.address, utils.id.parse(file.id).index + 1);
                const newFile = <RSS3ItemsList>this.main.files.new(newID);
                newFile.list = [item];
                newFile.list_next = file.id;
                this.main.files.set(newFile);

                const indexFile = <RSS3Index>await this.main.files.get(this.main.account.address);
                indexFile.items = newID;
                this.main.files.set(indexFile);
            } else {
                file.list.unshift(item);
                this.main.files.set(file);
            }

            return item;
        } else {
            throw Error('Parameter error');
        }
    }

    async patch(itemIn: ItemPatch) {
        if (utils.check.valueLength(itemIn) && itemIn.id && equals<ItemPatch>(itemIn)) {
            const position = await this.getPosition(itemIn.id);

            if (position.index !== -1) {
                position.file!.list![position.index] = Object.assign(position.file!.list![position.index], itemIn);

                this.main.files.set(position.file!);
                return position.file!.list![position.index];
            } else {
                return null;
            }
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Items;
