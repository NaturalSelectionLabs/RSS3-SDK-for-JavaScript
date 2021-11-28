import Main from '../index';
import utils from '../utils';

class Backlinks {
    private main: Main;
    private type: 'auto' | 'custom';

    constructor(main: Main, type: 'auto' | 'custom') {
        this.main = main;
        this.type = type;
    }

    private async getItem(itemID: string) {
        return await this.main.items[this.type].get(itemID);
    }

    private async getPosition(itemID: string, id: string) {
        const item = await this.getItem(itemID);
        const index = (item?.backlinks || []).findIndex((lks) => lks.id === id);
        return {
            item,
            index,
            id: index !== -1 ? item!.backlinks![index].list : null,
        };
    }

    async getListFile(itemID: string, id: string, index = -1) {
        if (index < 0) {
            const item = await this.getItem(itemID);
            if (item?.backlinks) {
                const fileID = item.backlinks.find((link) => link.id === id)?.list;
                if (!fileID) {
                    throw new Error(`items ${itemID} backlinks ${id ? `id ${id} ` : ''}does not exist`);
                }
                const parsed = utils.id.parse(fileID);
                return <RSS3List>(
                    await this.main.files.get(
                        utils.id.get(parsed.persona, parsed.type, parsed.index + index + 1, parsed.payload),
                    )
                );
            } else {
                return null;
            }
        } else {
            const parsed = utils.id.parse(itemID);
            return <RSS3List>(
                await this.main.files.get(
                    utils.id.get(parsed.persona, 'list', index, ['item', parsed.index + '', 'backlinks', id]),
                )
            );
        }
    }

    async getList(itemID: string, type: string, breakpoint?: (file: RSS3BacklinksList) => boolean) {
        const { id } = await this.getPosition(itemID, type);
        if (id) {
            return <RSS3ID[]>await this.main.files.getAll(id, (file) => {
                return breakpoint?.(<RSS3BacklinksList>file) || false;
            });
        } else {
            return [];
        }
    }
}

export default Backlinks;
