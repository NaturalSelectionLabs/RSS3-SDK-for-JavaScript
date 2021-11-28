import Main from './index';
import utils from './utils';
import { equals } from 'typescript-is';

class Assets {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async getListFile(persona: string, index = -1) {
        return <RSS3AssetsList | null>await this.main.files.getList(persona, 'assets', index);
    }

    async getList(persona: string, breakpoint?: (file: RSS3AssetsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.assets) {
            return <RSS3Asset[]>await this.main.files.getAll(indexFile.assets, (file) => {
                return breakpoint?.(<RSS3AssetsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private async getPosition(asset: RSS3Asset) {
        let result: {
            file: RSS3AssetsList | null;
            index: number;
        } = {
            file: null,
            index: -1,
        };

        await this.getList(this.main.account.address, (file) => {
            if (!file.list) {
                return false;
            }
            const index = file.list.findIndex((as) => as.id === asset.id);
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
                (file) => !!file.list && file.list.findIndex((as) => as.id === asset.id) > -1,
            );
            const index = list.findIndex((as) => as.id === asset.id);
            if (index === -1) {
                let file = await this.getListFile(this.main.account.address, -1);
                if (!file) {
                    const newID = utils.id.getAssets(this.main.account.address, 0);
                    file = <RSS3AssetsList>this.main.files.new(newID);
                }
                if (!file.list) {
                    file.list = [];
                }
                if (!utils.check.fileSizeWithNew(file, asset)) {
                    const newID = utils.id.getAssets(this.main.account.address, utils.id.parse(file.id).index + 1);
                    const newFile = <RSS3AssetsList>this.main.files.new(newID);
                    newFile.list = [asset];
                    newFile.list_next = file.id;
                    this.main.files.set(newFile);

                    const indexFile = <RSS3Index>await this.main.files.get(this.main.account.address);
                    indexFile.assets = newID;
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

    async patchTags(asset: RSS3CustomAsset, tags: string[]) {
        if (utils.check.valueLength(asset) && equals<RSS3CustomAsset>(asset)) {
            const position = await this.getPosition(asset);

            if (position.index !== -1) {
                if (!(<RSS3AutoAsset>position.file!.list![position.index]).auto) {
                    (<RSS3CustomAsset>position.file!.list![position.index]).tags = tags;
                    this.main.files.set(position.file!);
                    return position.file!.list![position.index];
                } else {
                    throw Error('Cannot add tags to node assets');
                }
            } else {
                return null;
            }
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Assets;
