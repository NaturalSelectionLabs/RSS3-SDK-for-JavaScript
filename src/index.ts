import EthCrypto from 'eth-crypto';
import { equals } from 'typescript-is';
import config from './config';
import utils from './utils';
import axois from 'axios';

interface IOption {
    endpoint: string;
    privateKey?: string;
    callback?: (persona?: RSS3Index) => void;
}

interface IItemIn {
    id?: string;
    authors?: RSS3ID[];
    title?: string;
    summary?: string;
    tags?: string[];

    type?: string;
    upstream?: RSS3ItemID;

    contents?: {
        address: ThirdPartyAddress;
        mime_type: string;
        name?: string;
        tags?: string[];
        size_in_bytes?: string;
        duration_in_seconds?: string;
    }[];
}

class RSS3 {
    private privateKey: string;
    private address: string;
    private files: {
        [key: string]: RSS3IContent;
    } = {};
    private dirtyFiles: {
        [key: string]: number;
    } = {};
    private endpoint: string;

    constructor(option: IOption) {
        this.endpoint = option.endpoint;
        if (option.privateKey) {
            this.privateKey = option.privateKey;
            this.address = EthCrypto.publicKey.toAddress(
                EthCrypto.publicKeyByPrivateKey(option.privateKey),
            );
            this.getFile(this.address).then(() => {
                option.callback?.(<RSS3Index>this.files[this.address]);
            });
        } else {
            const keys = EthCrypto.createIdentity();
            this.privateKey = keys.privateKey;
            this.address = keys.address;
            const nowDate = new Date().toISOString();
            (<RSS3Index>this.files[this.address]) = {
                id: this.address,
                '@version': config.version,
                date_created: nowDate,
                date_updated: nowDate,
                signature: '',
            };
            this.dirtyFiles[this.address] = 1;
            option.callback?.(<RSS3Index>this.files[this.address]);
        }
    }

    profilePatch(profile: RSS3Profile) {
        if (
            utils.attributeslengthCheck(profile) &&
            equals<RSS3Profile>(profile)
        ) {
            const file = <RSS3Index>this.files[this.address];
            file.profile = Object.assign({}, file.profile, profile);
            utils.removeEmptyProperties(file.profile, {
                obj: file,
                key: 'profile',
            });
            this.dirtyFiles[this.address] = 1;
            return this.files[this.address];
        } else {
            return null;
        }
    }

    itemPost(itemIn: IItemIn) {
        if (utils.attributeslengthCheck(itemIn) && equals<IItemIn>(itemIn)) {
            const nowDate = new Date().toISOString();
            const file = <RSS3Index>this.files[this.address];
            if (!file.items) {
                file.items = [];
            }

            const id = file.items[0]
                ? parseInt(file.items[0].id.split('-')[2]) + 1
                : 0;

            const item: RSS3Item = Object.assign(
                {
                    authors: [this.address],
                },
                itemIn,
                {
                    id: `${this.address}-item-${id}`,
                    date_published: nowDate,
                    date_modified: nowDate,
                    signature: '',
                },
            );
            utils.removeEmptyProperties(item);
            item.signature = this.sign(item);

            file.items.unshift(item);

            if (file.items.length > config.itemPageSize) {
                const newList = file.items.slice(1);
                const newID =
                    this.address +
                    '-items-' +
                    (file.items_next
                        ? parseInt(file.items_next.split('-')[2]) + 1
                        : 1);
                this.files[newID] = {
                    id: newID,
                    '@version': config.version,
                    date_created: nowDate,
                    date_updated: nowDate,
                    signature: '',

                    items: newList,
                    items_next: file.items_next,
                };

                file.items = file.items.slice(0, 1);
                file.items_next = newID;

                this.dirtyFiles[newID] = 1;
            }

            file.date_updated = nowDate;
            this.dirtyFiles[this.address] = 1;

            return item;
        } else {
            return null;
        }
    }

    async itemsPatch(itemIn: IItemIn, fileID: string) {
        if (
            utils.attributeslengthCheck(itemIn) &&
            itemIn.id &&
            equals<IItemIn>(itemIn)
        ) {
            const file = await this.getFile(fileID);
            if (equals<RSS3IContent>(file)) {
                const index = file.items.findIndex(
                    (item) => item.id === itemIn.id,
                );
                if (index !== -1) {
                    file.items[index] = Object.assign(
                        file.items[index],
                        itemIn,
                        {
                            date_modified: new Date().toISOString(),
                        },
                    );
                    utils.removeEmptyProperties(file.items[index]);
                    file.items[index].signature = this.sign(file.items[index]);

                    this.dirtyFiles[fileID] = 1;
                    return file.items[index];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    linksPost() {
        // TODO
    }

    linksPatch() {
        // TODO
    }

    syncFile(fileIDs: string[] = Object.keys(this.dirtyFiles)) {
        const contents = fileIDs.map((fileID) => {
            const content = this.files[fileID];
            content.signature = this.sign(content);
            return content;
        });
        return axois({
            method: 'put',
            url: `${this.endpoint}/files`,
            data: {
                contents: contents,
            },
        }).then(() => {
            fileIDs.forEach((fileID) => {
                delete this.dirtyFiles[fileID];
            });
        });
    }

    getFile(fileID: string): Promise<RSS3IContent> {
        if (this.files[fileID]) {
            return new Promise((resolve) => {
                resolve(this.files[fileID]);
            });
        } else {
            return new Promise(async (resolve, reject) => {
                try {
                    const data = await axois({
                        method: 'get',
                        url: `${this.endpoint}/files/${fileID}`,
                    });
                    const content = data.data;
                    if (equals<RSS3IContent>(content)) {
                        const message = JSON.stringify(
                            utils.removeNotSignProperties(content),
                        );
                        const signer = EthCrypto.recover(
                            content.signature,
                            EthCrypto.hash.keccak256(message),
                        );
                        if (signer === fileID.split('-')[0]) {
                            this.files[fileID] = content;
                            resolve(this.files[fileID]);
                        } else {
                            reject('The signature does not match.');
                        }
                    } else {
                        reject('Incorrectly formatted content.');
                    }
                } catch (error) {
                    if (error.response.status === 404) {
                        const nowDate = new Date().toISOString();
                        this.files[fileID] = {
                            id: fileID,
                            '@version': config.version,
                            date_created: nowDate,
                            date_updated: nowDate,
                            signature: '',
                        };
                        this.dirtyFiles[fileID] = 1;
                        resolve(this.files[fileID]);
                    } else {
                        reject('Server response error.');
                    }
                }
            });
        }
    }

    deleteFile() {
        return axois({
            method: 'delete',
            url: `${this.endpoint}/files`,
            data: {
                signature: EthCrypto.sign(
                    this.privateKey,
                    EthCrypto.hash.keccak256(`delete`),
                ),
            },
        });
    }

    sign(obj: any) {
        const message = JSON.stringify(utils.removeNotSignProperties(obj));
        return EthCrypto.sign(
            this.privateKey,
            EthCrypto.hash.keccak256(message),
        );
    }
}

export default RSS3;
