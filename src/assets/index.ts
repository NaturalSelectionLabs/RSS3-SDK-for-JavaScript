import Main from '../index';
import AutoAssets from './auto';
import CustomAssets from './custom';

class Assets {
    auto: AutoAssets;
    custom: CustomAssets;

    constructor(main: Main) {
        this.auto = new AutoAssets(main);
        this.custom = new CustomAssets(main);
    }
}

export default Assets;
