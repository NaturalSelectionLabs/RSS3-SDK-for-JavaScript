import Main from './index';
import utils from './utils';
import axois from 'axios';
import { equals } from 'typescript-is';
import config from './config';
import type { RSS3IContent, RSS3Content, RSS3List } from '../types/rss3';

class File {
    private main: Main;
    private list: {
        [key: string]: RSS3Content;
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
            '@version': config.version,
            date_created: nowDate,
            date_updated: nowDate,
            signature: '',
        });

        return this.list[fileID];
    }

    get(fileID: string = this.main.account.address, force?: boolean): Promise<RSS3Content> {
        if (this.list[fileID] && !force) {
            return new Promise<RSS3Content>((resolve) => {
                resolve(this.list[fileID]);
            });
        } else {
            return new Promise<RSS3Content>(async (resolve, reject) => {
                try {
                    const data = await axois({
                        method: 'get',
                        url: `${this.main.options.endpoint}/${fileID}`,
                    });
                    const content = data.data;
                    if (equals<RSS3IContent>(content)) {
                        // const check = this.main.account.check(content, utils.id.parse(fileID).persona);
                        const check = true;
                        if (check) {
                            this.list[fileID] = content;
                            resolve(this.list[fileID]);
                        } else {
                            reject('The signature does not match.');
                        }
                    } else if (equals<RSS3List>(content)) {
                        this.list[fileID] = content;
                        resolve(this.list[fileID]);
                    } else {
                        reject('Incorrectly formatted content.');
                    }
                } catch (error) {
                    if (error.response?.data?.code === 5001) {
                        const nowDate = new Date().toISOString();
                        this.list[fileID] = {
                            id: fileID,
                            '@version': config.version,
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

    set(content: RSS3IContent) {
        content.date_updated = new Date().toISOString();
        content['@version'] = config.version;
        this.list[content.id] = content;
        this.dirtyList[content.id] = 1;
    }

    async sync() {
        const fileIDs = Object.keys(this.dirtyList);
        const contents = await Promise.all(
            fileIDs.map(async (fileID) => {
                const content = this.list[fileID];
                await this.main.account.sign(content);
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
