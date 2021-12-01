import Main from '../index';
import utils from '../utils';
import { equals } from 'typescript-is';
import Backlinks from './backlinks';

type ItemPost = Omit<RSS3CustomItem, 'id' | 'date_created' | 'date_updated'>;

interface ItemPatch extends Partial<RSS3CustomItem> {
    id: RSS3CustomItemID;
}

class CustomItems {
    private main: Main;
    backlinks: Backlinks;

    constructor(main: Main) {
        this.main = main;
        this.backlinks = new Backlinks(main, 'auto');
    }

    async getListFile(persona: string, index = -1) {
        return <RSS3CustomItemsList | null>await this.main.files.getList(persona, 'items', index, 'list_custom');
    }

    async getList(persona: string, breakpoint?: (file: RSS3CustomItemsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.items?.list_custom) {
            return <RSS3CustomItem[]>await this.main.files.getAll(indexFile.items.list_custom, (file) => {
                return breakpoint?.(<RSS3CustomItemsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private async getPosition(itemID: string) {
        let result: {
            file: RSS3CustomItemsList | null;
            index: number;
        } = {
            file: null,
            index: -1,
        };
        await this.getList(this.main.account.address, (file) => {
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
                const newID = utils.id.getCustomItems(this.main.account.address, 0);
                file = <RSS3CustomItemsList>this.main.files.new(newID);
            }
            if (!file.list) {
                file.list = [];
            }

            const id = file.list[0] ? utils.id.parse(file.list[0].id).index + 1 : 0;

            const nowDate = new Date().toISOString();
            const item: RSS3CustomItem = Object.assign(
                {
                    date_created: nowDate,
                },
                itemIn,
                {
                    id: utils.id.getCustomItem(this.main.account.address, id),
                    date_updated: nowDate,
                },
            );

            if (!utils.check.fileSizeWithNew(file, item)) {
                const newID = utils.id.getCustomItems(this.main.account.address, utils.id.parse(file.id).index + 1);
                const newFile = <RSS3CustomItemsList>this.main.files.new(newID);
                newFile.list = [item];
                newFile.list_next = file.id;
                this.main.files.set(newFile);

                const indexFile = <RSS3Index>await this.main.files.get(this.main.account.address);
                if (!indexFile.items) {
                    indexFile.items = {};
                }
                indexFile.items!.list_custom = newID;
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
                position.file!.list![position.index] = Object.assign(position.file!.list![position.index], itemIn, {
                    date_updated: new Date().toISOString(),
                    date_created: position.file!.list![position.index].date_created,
                });

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

export default CustomItems;
