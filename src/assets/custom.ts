import Main from '../index';
import utils from '../utils';
import { equals } from 'typescript-is';

class CustomAssets {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async getListFile(persona: string, index = -1) {
        return <RSS3CustomAssetsList | null>await this.main.files.getList(persona, 'assets', index, 'list_custom');
    }

    async getList(persona: string, breakpoint?: (file: RSS3CustomAssetsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.assets?.list_custom) {
            return <RSS3CustomAsset[]>await this.main.files.getAll(indexFile.assets.list_custom, (file) => {
                return breakpoint?.(<RSS3CustomAssetsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private async getPosition(asset: RSS3CustomAsset) {
        let result: {
            file: RSS3CustomAssetsList | null;
            index: number;
        } = {
            file: null,
            index: -1,
        };

        await this.getList(this.main.account.address, (file) => {
            if (!file.list) {
                return false;
            }
            const index = file.list.findIndex((as) => as === asset);
            if (index !== -1) {
                result = {
                    file,
                    index,
                };
                return true;
            } else {
                return false;
            }
        });
        return result;
    }

    async post(asset: RSS3CustomAsset) {
        if (utils.check.valueLength(asset) && equals<RSS3CustomAsset>(asset)) {
            const list = await this.getList(
                this.main.account.address,
                (file) => !!file.list && file.list.findIndex((as) => as === asset) > -1,
            );
            const index = list.findIndex((as) => as === asset);
            if (index === -1) {
                let file = await this.getListFile(this.main.account.address, -1);
                if (!file) {
                    const newID = utils.id.getCustomAssets(this.main.account.address, 0);
                    file = <RSS3CustomAssetsList>this.main.files.new(newID);

                    const indexFile = <RSS3Index>await this.main.files.get(this.main.account.address);
                    if (!indexFile.assets) {
                        indexFile.assets = {};
                    }
                    indexFile.assets.list_custom = newID;
                }
                if (!file.list) {
                    file.list = [];
                }
                if (!utils.check.fileSizeWithNew(file, asset)) {
                    const newID = utils.id.getCustomAssets(
                        this.main.account.address,
                        utils.id.parse(file.id).index + 1,
                    );
                    const newFile = <RSS3CustomAssetsList>this.main.files.new(newID);
                    newFile.list = [asset];
                    newFile.list_next = file.id;
                    this.main.files.set(newFile);

                    const indexFile = <RSS3Index>await this.main.files.get(this.main.account.address);
                    if (!indexFile.assets) {
                        indexFile.assets = {};
                    }
                    indexFile.assets.list_custom = newID;
                    this.main.files.set(indexFile);
                } else {
                    file.list.unshift(asset);
                    this.main.files.set(file);
                }

                return asset;
            } else {
                throw Error('Asset already exists');
            }
        } else {
            throw Error('Parameter error');
        }
    }

    async delete(asset: RSS3CustomAsset) {
        const { file, index } = await this.getPosition(asset);
        let result = null;
        if (index !== -1) {
            file!.list!.splice(index, 1);
            result = file!.list;
            this.main.files.set(file!);
        } else {
            throw Error('Asset not found');
        }
        return result;
    }
}

export default CustomAssets;
