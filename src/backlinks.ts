import Main from './index';
import type { RSS3Index, RSS3List } from '../types/rss3';

class Backlinks {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(personaID: string = this.main.account.address, type?: string) {
        const backlinksList = (<RSS3Index>await this.main.file.get(personaID))['@backlinks'] || [];
        if (type) {
            const backlink = backlinksList.find((backlink) => backlink.type === type);
            if (!backlink) {
                return [];
            }
            let fileID = backlink.list;
            let list: string[] = [];
            do {
                const currentList = <RSS3List>await this.main.file.get(fileID);
                list = list.concat(currentList.list);
                fileID = currentList.list_next;
            } while (fileID);
            return list;
        } else {
            return backlinksList;
        }
    }
}

export default Backlinks;
