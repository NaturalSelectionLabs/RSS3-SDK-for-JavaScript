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
}

export default AutoAssets;
