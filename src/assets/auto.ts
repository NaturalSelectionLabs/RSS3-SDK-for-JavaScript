import Main from '../index';

class AutoAssets {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async getListFile(persona: string, index = -1) {
        return <RSS3AutoAssetsList | null>await this.main.files.getList(persona, 'assets', index, 'list_auto');
    }

    async getList(persona: string, breakpoint?: (file: RSS3AutoAssetsList) => boolean) {
        const indexFile = <RSS3Index>await this.main.files.get(persona);
        if (indexFile.assets?.list_auto) {
            return <RSS3AutoAsset[]>await this.main.files.getAll(indexFile.assets.list_auto, (file) => {
                return breakpoint?.(<RSS3AutoAssetsList>file) || false;
            });
        } else {
            return [];
        }
    }

    private async getPosition(asset: RSS3AutoAsset) {
        let result: {
            file: RSS3AutoAssetsList | null;
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

    async get(asset: string) {
        const position = await this.getPosition(asset);
        if (position.index !== -1) {
            return position.file!.list![position.index];
        } else {
            return null;
        }
    }
}

export default AutoAssets;
