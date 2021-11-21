import Main from './index';
import utils from './utils';
import axois from 'axios';
import { equals } from 'typescript-is';
import config from './config';

class File {
    private main: Main;
    private list: {
        [key: string]: RSS3File;
    } = {};
    private dirtyList: {
        [key: string]: number;
    } = {};

    constructor(main: Main) {
        this.main = main;
    }

    new(fileID: string) {
        const nowDate = new Date().toISOString();
        this.set({
            id: fileID,
            version: config.version,
            date_created: nowDate,
            date_updated: nowDate,
            signature: '',
        });

        return this.list[fileID];
    }

    get(fileID: string = this.main.account.address, force?: boolean): Promise<RSS3File> {
        if (this.list[fileID] && !force) {
            return new Promise<RSS3File>((resolve) => {
                resolve(this.list[fileID]);
            });
        } else {
            return new Promise<RSS3File>(async (resolve, reject) => {
                try {
                    const data = await axois({
                        method: 'get',
                        url: `${this.main.options.endpoint}/${fileID}`,
                    });
                    const content = data.data;
                    if (equals<RSS3File>(content)) {
                        // const check = this.main.account.check(content, utils.id.parse(fileID).persona);
                        // if (!check) {
                        //     reject('The signature does not match.');
                        // }
                        this.list[fileID] = content;
                        resolve(this.list[fileID]);
                    } else {
                        reject('Incorrectly formatted content.');
                    }
                } catch (error: any) {
                    if (error.response?.data?.code === 5001) {
                        const nowDate = new Date().toISOString();
                        this.list[fileID] = {
                            id: fileID,
                            version: config.version,
                            date_created: nowDate,
                            date_updated: nowDate,
                            signature: '',
                        };
                        this.dirtyList[fileID] = 1;
                        resolve(this.list[fileID]);
                    } else {
                        reject('Server response error.');
                    }
                }
            });
        }
    }

    async getAll(fileID: RSS3ListID, breakpoint?: (file: RSS3List) => boolean) {
        let list: (RSS3ID | RSS3ItemID | RSS3Asset | RSS3Item)[] = [];
        let id: string | undefined = fileID;
        do {
            const listFile = <RSS3List>await this.main.files.get(fileID);
            if (breakpoint && breakpoint(listFile)) {
                break;
            }
            list = list.concat(listFile.list || []);
            id = listFile.list_next;
        } while (fileID);
        return list;
    }

    set(content: RSS3File) {
        utils.object.removeEmpty(content);
        content.date_updated = new Date().toISOString();
        content.version = config.version;
        if (utils.check.fileSize(content)) {
            this.list[content.id] = content;
            this.dirtyList[content.id] = 1;
        } else {
            throw new Error('File size is too large.');
        }
    }

    clearCache(key: string, wildcard?: boolean) {
        if (wildcard) {
            Object.keys(this.list).forEach((fileID) => {
                if (fileID.includes(key)) {
                    delete this.list[fileID];
                }
            });
        } else {
            delete this.list[key];
        }
    }

    async sync() {
        const fileIDs = Object.keys(this.dirtyList);
        const contents = await Promise.all(
            fileIDs.map(async (fileID) => {
                const content = this.list[fileID];
                await this.main.account.sign(content);
                if ('auto' in content) {
                    // @ts-ignore
                    delete content.auto;
                }
                return content;
            }),
        );
        return axois({
            method: 'put',
            url: this.main.options.endpoint,
            data: {
                contents: contents,
            },
        }).then(() => {
            fileIDs.forEach((fileID) => {
                delete this.dirtyList[fileID];
            });
        });
    }
}

export default File;
