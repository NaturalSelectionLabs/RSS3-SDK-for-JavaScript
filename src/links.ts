import Main from './index';
import utils from './utils';
import { equals } from 'typescript-is';
import config from './config';

interface LinksPost {
    tags?: string[];
    type: string;
    list?: RSS3ID[];
}

class Links {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    private async getPosition(persona: string, type: string) {
        const file = <RSS3Index>await this.main.files.get(persona);
        const index = (file.links || []).findIndex((lks) => lks.type === type);
        return {
            file,
            index,
            id: index !== -1 ? file.links![index].list : null,
        };
    }

    async getList(persona: string, type: string, index = -1) {
        if (index < 0) {
            const indexFile = <RSS3Index>await this.main.files.get(persona);
            if (indexFile.links) {
                const linksId = indexFile.links.find((links) => links.type === type)?.list;
                if (!linksId) {
                    throw new Error('Link type does not exist');
                }
                const parsed = utils.id.parse(linksId);
                index = parsed.index + index + 1;
                const file = <RSS3List>await this.main.files.get(utils.id.getLinks(persona, type, index));
                return {
                    list: file.list || [],
                    list_next: file.list_next,
                };
            } else {
                return null;
            }
        } else {
            const file = <RSS3List>await this.main.files.get(utils.id.getLinks(persona, type, index));
            return {
                list: file.list || [],
                list_next: file.list_next,
            };
        }
    }

    async getAllList(persona: string, type: string, breakpoint?: (file: RSS3LinksList) => boolean) {
        const { id } = await this.getPosition(persona, type);
        if (id) {
            return <RSS3ID[]>await this.main.files.getAll(id, (file) => {
                return breakpoint?.(<RSS3LinksList>file) || false;
            });
        } else {
            return [];
        }
    }

    async postList(links: LinksPost) {
        if (utils.check.valueLength(links) && equals<LinksPost>(links)) {
            const { index, file } = await this.getPosition(this.main.account.address, links.type);
            if (index === -1) {
                links.list?.forEach((link) => {
                    this.main.files.clearCache(utils.id.getLinks(link, links.type, ''), true);
                });
                const newID = utils.id.getLinks(this.main.account.address, links.type, 0);
                const newFile = <RSS3List>this.main.files.new(newID);
                if (!file.links) {
                    file.links = [];
                }
                file.links.push({
                    tags: links.tags,
                    type: links.type,
                    list: newID,
                });
                newFile.list = links.list;
                if (!utils.check.fileSize(newFile)) {
                    this.main.files.clearCache(newID);
                    throw Error('Exceeding the file size limit');
                }
                this.main.files.set(file);
                this.main.files.set(newFile);
            } else {
                throw Error('Link type already exists');
            }
            return links;
        } else {
            throw Error('Parameter error');
        }
    }

    async deleteList(type: string) {
        const { index, file } = await this.getPosition(this.main.account.address, type);
        if (index > -1) {
            const links = file.links![index];
            if (links.list) {
                const listFile = <RSS3LinksList>await this.main.files.get(links.list);
                listFile.list?.forEach((link) => {
                    this.main.files.clearCache(utils.id.getBacklinks(link, links.type, ''), true);
                });
            }
            file.links!.splice(index, 1);
            this.main.files.set(file);
            return links;
        }
    }

    async patchListTags(type: string, tags: string[]) {
        if (utils.check.valueLength(tags) && equals<string[]>(tags)) {
            const { index, file } = await this.getPosition(this.main.account.address, type);
            if (index > -1) {
                file.links![index].tags = tags;
                this.main.files.set(file);
                return file.links![index];
            } else {
                throw Error('Link type does not exist');
            }
        } else {
            throw Error('Parameter error');
        }
    }

    async post(type: string, personaID: string) {
        const { file: indexFile, id } = await this.getPosition(this.main.account.address, type);
        if (id) {
            const list = await this.getAllList(
                this.main.account.address,
                type,
                (file) => !!file.list && file.list.indexOf(personaID) > -1,
            );
            const index = list.indexOf(personaID);
            if (index === -1) {
                this.main.files.clearCache(utils.id.getBacklinks(personaID, type, ''), true);
                const file = <RSS3LinksList>await this.main.files.get(id);
                if (!file.list) {
                    file.list = [];
                }

                if (!utils.check.fileSize(JSON.parse(JSON.stringify(file)).list.unshift(personaID))) {
                    const newID = utils.id.getLinks(this.main.account.address, type, utils.id.parse(file.id).index + 1);
                    const newFile = <RSS3LinksList>this.main.files.new(newID);
                    newFile.list = [personaID];
                    newFile.list_next = file.id;
                    this.main.files.set(newFile);

                    indexFile.links![index].list = newID;
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
                type: type,
                list: [personaID],
            });
        }
    }

    async delete(type: string, personaID: string) {
        const { id } = await this.getPosition(this.main.account.address, type);
        let result = null;
        if (id) {
            await this.getAllList(this.main.account.address, type, (file) => {
                if (!file.list) {
                    return false;
                }
                const index = file.list.indexOf(personaID);
                if (index > -1) {
                    this.main.files.clearCache(utils.id.getBacklinks(personaID, type, ''), true);
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
