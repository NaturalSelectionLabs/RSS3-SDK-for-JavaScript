import Main from './index';
import utils from './utils';
import { equals } from 'typescript-is';

interface LinksPost {
    tags?: string[];
    id: string;
    list?: RSS3ID[];
}

class Links {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    private async getPosition(persona: string, id: string) {
        const file = <RSS3Index>await this.main.files.get(persona);
        const index = (file.links || []).findIndex((lks) => lks.id === id);
        return {
            file,
            index,
            fileID: index !== -1 ? file.links![index].list : null,
        };
    }

    async getListFile(persona: string, id: string, index = -1) {
        return <RSS3LinksList | null>await this.main.files.getList(persona, 'links', index, id);
    }

    async getList(persona: string, id: string, breakpoint?: (file: RSS3LinksList) => boolean) {
        const { fileID } = await this.getPosition(persona, id);
        if (fileID) {
            return <RSS3ID[]>await this.main.files.getAll(fileID, (file) => {
                return breakpoint?.(<RSS3LinksList>file) || false;
            });
        } else {
            return [];
        }
    }

    async postList(links: LinksPost) {
        if (utils.check.valueLength(links) && equals<LinksPost>(links)) {
            const { index, file } = await this.getPosition(this.main.account.address, links.id);
            if (index === -1) {
                links?.list?.forEach((link) => {
                    this.main.files.clearCache(utils.id.getLinks(link, links.id, ''), true);
                });
                const newID = utils.id.getLinks(this.main.account.address, links.id, 0);
                const newFile = <RSS3List>this.main.files.new(newID);
                if (!file.links) {
                    file.links = [];
                }
                file.links.push({
                    tags: links.tags,
                    id: links.id,
                    list: newID,
                });
                if (links.list) {
                    newFile.list = links.list;
                }
                if (!utils.check.fileSize(newFile)) {
                    this.main.files.clearCache(newID);
                    throw Error('Exceeding the file size limit');
                }
                this.main.files.set(file);
                this.main.files.set(newFile);
            } else {
                throw Error('Link id already exists');
            }
            return links;
        } else {
            throw Error('Parameter error');
        }
    }

    async deleteList(id: string) {
        const { index, file } = await this.getPosition(this.main.account.address, id);
        if (index > -1) {
            const links = file.links![index];
            if (links.list) {
                const listFile = <RSS3LinksList>await this.main.files.get(links.list);
                listFile.list?.forEach((link) => {
                    this.main.files.clearCache(utils.id.getBacklinks(link, links.id, ''), true);
                });
            }
            file.links!.splice(index, 1);
            this.main.files.set(file);
            return links;
        }
    }

    async patchListTags(id: string, tags: string[]) {
        if (utils.check.valueLength(tags) && equals<string[]>(tags)) {
            const { index, file } = await this.getPosition(this.main.account.address, id);
            if (index > -1) {
                file.links![index].tags = tags;
                this.main.files.set(file);
                return file.links![index];
            } else {
                throw Error('Link id does not exist');
            }
        } else {
            throw Error('Parameter error');
        }
    }

    async post(id: string, personaID: string) {
        const { file: indexFile, fileID, index: linksIndex } = await this.getPosition(this.main.account.address, id);
        if (fileID) {
            const list = await this.getList(
                this.main.account.address,
                id,
                (file) => !!file.list && file.list.indexOf(personaID) > -1,
            );
            const index = list.indexOf(personaID);
            if (index === -1) {
                this.main.files.clearCache(utils.id.getBacklinks(personaID, id, ''), true);
                const file = <RSS3LinksList>await this.main.files.get(fileID);
                if (!file.list) {
                    file.list = [];
                }

                if (!utils.check.fileSizeWithNew(file, personaID)) {
                    const newID = utils.id.getLinks(this.main.account.address, id, utils.id.parse(file.id).index + 1);
                    const newFile = <RSS3LinksList>this.main.files.new(newID);
                    newFile.list = [personaID];
                    newFile.list_next = file.id;
                    this.main.files.set(newFile);

                    indexFile.links![linksIndex].list = newID;
                    this.main.files.set(indexFile);
                } else {
                    file.list.unshift(personaID);
                    this.main.files.set(file);
                }

                await this.main.files.set(file);
                return file;
            } else {
                throw Error('Link already exist');
            }
        } else {
            await this.postList({
                id: id,
                list: [personaID],
            });
        }
    }

    async delete(id: string, personaID: string) {
        const { fileID } = await this.getPosition(this.main.account.address, id);
        let result = null;
        if (fileID) {
            await this.getList(this.main.account.address, id, (file) => {
                if (!file.list) {
                    return false;
                }
                const index = file.list.indexOf(personaID);
                if (index > -1) {
                    this.main.files.clearCache(utils.id.getBacklinks(personaID, id, ''), true);
                    file.list.splice(index, 1);
                    result = file.list;
                    this.main.files.set(file);
                    return true;
                }
                return false;
            });
        }
        return result;
    }
}

export default Links;
