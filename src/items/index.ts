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

    async getListByPersona(options: {
        limit: number;
        tsp?: string;
        persona?: string;
        linkID?: string;
        fieldLike?: string;
        personaList?: string[];
    }) {
        const usePost = options.personaList && options.personaList.length > 250;
        const response = await axois({
            method: usePost ? 'post' : 'get',
            url: `${this.main.options.endpoint}/items/list`,
            [usePost ? 'data' : 'params']: {
                limit: options.limit,
                tsp: options.tsp,
                persona: options.persona,
                linkID: options.linkID,
                fieldLike: options.fieldLike,
                personaList: options.personaList?.join(','),
            },
        });
        return <(RSS3CustomItem | RSS3AutoItem)[]>response.data.data;
    }
}

export default Items;
