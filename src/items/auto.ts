import Main from '../index';
import Backlinks from './backlinks';

class AutoItems {
    private main: Main;
    backlinks: Backlinks;

    constructor(main: Main) {
        this.main = main;
        this.backlinks = new Backlinks(main, 'auto');
    }

    async getListFile(persona: string, index = -1) {
        return <RSS3AutoItemsList | null>await this.main.files.getList(persona, 'items', index, 'list_auto');
    }

    async getList(persona: string, breakpoint?: (file: RSS3AutoItemsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.items?.list_auto) {
            return <RSS3AutoItem[]>await this.main.files.getAll(indexFile.items.list_auto, (file) => {
                return breakpoint?.(<RSS3AutoItemsList>file) || false;
            });
        } else {
            return [];
        }
    }
}

export default AutoItems;
