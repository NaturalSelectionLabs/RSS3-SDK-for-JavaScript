import Main from '../index';
import utils from '../utils';

class AutoItems {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async getListFile(persona: string, index = -1) {
        return <RSS3AutoItemsList | null>await this.main.files.getList(persona, 'items', index, 'auto');
    }

    async getList(persona: string, breakpoint?: (file: RSS3AutoItemsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.items?.auto) {
            return <RSS3AutoItem[]>await this.main.files.getAll(indexFile.items.auto, (file) => {
                return breakpoint?.(<RSS3AutoItemsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private async getPosition(itemID: string) {
        let result: {
            file: RSS3AutoItemsList | null;
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
}

export default AutoItems;
