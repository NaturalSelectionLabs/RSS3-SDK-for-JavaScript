import Main from './index';
import utils from './utils';
import axois from 'axios';
import { equals } from 'typescript-is';
import config from './config';

class File {
    private main: Main;
    private list: {
        [key: string]: RSS3IContent;
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

    get(fileID: string): Promise<RSS3IContent> {
        if (this.list[fileID]) {
            return new Promise((resolve) => {
                resolve(this.list[fileID]);
            });
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await axois({
                        method: 'get',
                        url: `${this.main.options.endpoint}/${fileID}`,
                    });
                    const content = data.data;
                    if (equals<RSS3IContent>(content)) {
                        const check = utils.signature.check(content, utils.id.parse(fileID).persona);
                        if (check) {
                            this.list[fileID] = content;
                            resolve(this.list[fileID]);
                        } else {
                            reject('The signature does not match.');
                        }
                    } else {
                        reject('Incorrectly formatted content.');
                    }
                } catch (error) {
                    if (error.response.status === 404) {
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
        this.list[content.id] = content;
        this.dirtyList[content.id] = 1;
    }

    sync() {
        const fileIDs = Object.keys(this.dirtyList);
        const contents = fileIDs.map((fileID) => {
            const content = this.list[fileID];
            utils.signature.sign(content, this.main.persona.privateKey);
            return content;
        });
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
