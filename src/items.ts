import Main from './index';
import type { RSS3Index } from '../types/rss3';

class Items {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(fileID: string = this.main.account.address) {
        const file = <RSS3Index>await this.main.files.get(fileID);
        return {
            items: file.items,
            items_next: file.items_next,
        };
    }
}

export default Items;
