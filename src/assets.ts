import Main from './index';
import utils from './utils';
import { equals } from 'typescript-is';
import config from './config';

class Assets {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async getList(persona: string, index = -1) {
        if (index < 0) {
            const indexFile = <RSS3Index>await this.main.files.get(persona);
            if (indexFile.assets) {
                const parsed = utils.id.parse(indexFile.assets);
                index = parsed.index + index + 1;
                return <RSS3AssetsList>await this.main.files.get(utils.id.getAssets(persona, index));
            } else {
                return null;
            }
        } else {
            return <RSS3AssetsList>await this.main.files.get(utils.id.getAssets(persona, index));
        }
    }

    async getAllList(persona: string, breakpoint?: (file: RSS3AssetsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.assets) {
            return <RSS3Asset[]>await this.main.files.getAll(indexFile.assets, (file) => {
                return breakpoint?.(<RSS3AssetsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private assetsEquals(asset1: RSS3Asset, asset2: RSS3Asset) {
        return (
            asset1.platform === asset2.platform &&
            asset1.identity === asset2.identity &&
            asset1.id === asset2.id &&
            asset1.type === asset2.type
        );
    }

    private async getPosition(asset: RSS3Asset) {
        let result: {
            file: RSS3AssetsList | null;
            index: number;
        } = {
            file: null,
            index: -1,
        };
        this.getAllList(this.main.account.address, (file) => {
            if (!file.list) {
                return false;
            }
            const index = file.list.findIndex((as) => this.assetsEquals(as, asset));
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

    async post(asset: RSS3UserAsset) {
        if (utils.check.valueLength(asset) && equals<RSS3UserAsset>(asset)) {
            const list = await this.getAllList(
                this.main.account.address,
                (file) => !!file.list && file.list.findIndex((as) => this.assetsEquals(as, asset)) > -1,
            );
            const index = list.findIndex((as) => this.assetsEquals(as, asset));
            if (index === -1) {
                let file = await this.getList(this.main.account.address, -1);
                if (!file) {
                    const newID = utils.id.getAssets(this.main.account.address, 0);
                    file = <RSS3AssetsList>this.main.files.new(newID);
                }
                if (!file.list) {
                    file.list = [];
                }
                if (
                    new Blob([JSON.stringify(JSON.parse(JSON.stringify(file)).list.unshift(asset))]).size >
                    config.fileSizeLimit
                ) {
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

    async patch(asset: RSS3UserAsset) {
        if (utils.check.valueLength(asset) && equals<RSS3UserAsset>(asset)) {
            const position = await this.getPosition(asset);

            if (position.index !== -1) {
                position.file!.list![position.index] = Object.assign(position.file!.list![position.index], asset);

                this.main.files.set(position.file!);
                return position.file!.list![position.index];
            } else {
                return null;
            }
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Assets;
