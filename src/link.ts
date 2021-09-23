import Main from './index';
import type { RSS3Index } from '../types/rss3';

class Link {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async post(type: string, personaID: string) {
        const file = <RSS3Index>await this.main.files.get(this.main.account.address);
        const lks = (file.links || []).find((links) => links.type === type);
        if (lks) {
            if (!lks.list) {
                lks.list = [];
            }
            const index = lks.list.indexOf(personaID);
            if (index === -1) {
                this.main.files.clearCache(`${personaID}-backlink@${type}`);
                lks.list.push(personaID);
            } else {
                throw Error('Link already exist');
            }
            await this.main.files.set(file);
            return lks;
        } else {
            await this.main.links.post({
                type: type,
                list: [personaID],
            });
        }
    }

    async delete(type: string, personaID: string) {
        const file = <RSS3Index>await this.main.files.get(this.main.account.address);
        const lks = (file.links || []).find((links) => links.type === type);
        if (lks) {
            if (!lks.list) {
                lks.list = [];
            }
            const index = lks.list.indexOf(personaID);
            if (index !== -1) {
                this.main.files.clearCache(`${personaID}-backlink@${type}`);
                lks.list.splice(index, 1);
                if (lks.list.length === 0) {
                    delete lks.list;
                }
            } else {
                throw Error('Link does not exist');
            }
            await this.main.files.set(file);
            return lks;
        } else {
            throw Error('Link type does not exist');
        }
    }
}

export default Link;
