import Main from './index';
import type { RSS3Index, RSS3Asset } from '../types/rss3';
import utils from './utils';

class Assets {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async patchTags(asset: RSS3Asset, tags: string[]) {
        if (utils.check.valueLength(tags)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            const index = file.assets.findIndex(
                (ac) => ac.platform === asset.platform && ac.identity === asset.identity && ac.id === asset.id,
            );

            if (index !== -1) {
                file.assets[index].tags = tags;
                this.main.files.set(file);
                return file.assets[index];
            } else {
                return null;
            }
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Assets;
