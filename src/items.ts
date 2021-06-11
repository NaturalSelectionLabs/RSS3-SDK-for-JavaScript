import Main from './index';
import type { RSS3Index } from '../types/rss3';

class Items {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(fileID: string = this.main.persona.id) {
        const file = <RSS3Index>await this.main.file.get(fileID);
        return {
            items: file.items,
            items_next: file.items_next,
        };
    }
}

export default Items;
