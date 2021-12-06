import Main from '../index';
import AutoAssets from './auto';
import CustomAssets from './custom';
import axois from 'axios';
import type { AnyObject } from '../../types/extend';

class Assets {
    private main: Main;

    auto: AutoAssets;
    custom: CustomAssets;

    constructor(main: Main) {
        this.main = main;
        this.auto = new AutoAssets(main);
        this.custom = new CustomAssets(main);
    }

    async getDetails(options: { persona: string; assets: string[]; full?: boolean }) {
        const response = await axois({
            method: 'get',
            url: `${this.main.options.endpoint}/assets/details`,
            params: {
                persona: options.persona,
                assets: options.assets.join(','),
                full: options.full ? '1' : '0',
            },
        });
        return <AnyObject[]>response.data.data;
    }
}

export default Assets;
