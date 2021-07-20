import Main from './index';
import type { RSS3Index, RSS3LinksInput, RSS3Links } from '../types/rss3';
import utils from './utils';
import { equals } from 'typescript-is';

class Links {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(fileID: string = this.main.persona.id, type?: string) {
        const linksList = (<RSS3Index>await this.main.file.get(fileID)).links || [];
        if (type) {
            return linksList.find((links) => links.type === type);
        } else {
            return linksList;
        }
    }

    async post(links: RSS3LinksInput) {
        if (utils.check.valueLength(links) && equals<RSS3LinksInput>(links)) {
            const file = <RSS3Index>await this.main.file.get(this.main.persona.id);
            if (!file.links) {
                file.links = [];
            }
            if (!file.links.find((lks) => lks.type === links.type)) {
                utils.object.removeEmpty(links);
                await utils.accounts.sign(links, this.main.persona);
                file.links.push(<RSS3Links>links);
            } else {
                throw Error('Link type already exists');
            }
            this.main.file.set(file);
            return <RSS3Links>links;
        } else {
            throw Error('Parameter error');
        }
    }

    async delete(type: string) {
        const file = <RSS3Index>await this.main.file.get(this.main.persona.id);
        const index = (file.links || []).findIndex((lks) => lks.type === type);
        if (index > -1) {
            const links = file.links[index];
            file.links.splice(index, 1);
            if (file.links.length === 0) {
                delete file.links;
            }
            this.main.file.set(file);
            return links;
        } else {
            throw Error('Link type does not exist');
        }
    }

    async patch(links: RSS3LinksInput) {
        if (utils.check.valueLength(links) && equals<RSS3LinksInput>(links)) {
            const file = <RSS3Index>await this.main.file.get(this.main.persona.id);
            const linksList = file.links;
            const index = (linksList || []).findIndex((lks) => lks.type === links.type);
            if (index > -1) {
                linksList[index] = Object.assign(linksList[index], links);
                utils.object.removeEmpty(links);
                await utils.accounts.sign(links, this.main.persona);
                this.main.file.set(file);
                return linksList[index];
            } else {
                throw Error('Link type does not exist');
            }
        }
    }
}

export default Links;
