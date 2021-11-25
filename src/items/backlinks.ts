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

    private async getPosition(itemID: string, type: string) {
        const item = await this.getItem(itemID);
        const index = (item?.backlinks || []).findIndex((lks) => lks.type === type);
        return {
            item,
            index,
            id: index !== -1 ? item!.backlinks![index].list : null,
        };
    }

    async getListFile(itemID: string, type: string, index = -1) {
        if (index < 0) {
            const item = await this.getItem(itemID);
            if (item?.backlinks) {
                const fileID = item.backlinks.find((link) => link.type === type)?.list;
                if (!fileID) {
                    throw new Error(`items ${itemID} backlinks ${type ? `type ${type} ` : ''}does not exist`);
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
                    utils.id.get(parsed.persona, 'list', index, ['item', parsed.index + '', 'backlinks', type]),
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
