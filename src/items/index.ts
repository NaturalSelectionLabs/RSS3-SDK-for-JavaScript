import Main from '../index';
import AutoItems from './auto';
import CustomItems from './custom';
import axois from 'axios';

class Items {
    private main: Main;

    auto: AutoItems;
    custom: CustomItems;

    constructor(main: Main) {
        this.main = main;
        this.auto = new AutoItems(main);
        this.custom = new CustomItems(main);
    }

    async getListByPersona(options: { limit: number; tsp: string; persona: string; linkID?: string }) {
        const response = await axois({
            method: 'get',
            url: `${this.main.options.endpoint}/items/list`,
            params: {
                limit: options.limit,
                tsp: options.tsp,
                persona: options.persona,
                linkID: options.linkID,
            },
        });
        return <(RSS3CustomItem | RSS3AutoItem)[]>response.data.data;
    }
}

export default Items;
