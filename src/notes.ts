import Main from './index';

class Notes {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(
        instance: string | Instance,
        queries: {
            limit?: number;
            last_time?: string;
            tags?: string[];
            mime_types?: string[];
            item_sources?: string[];
            link_source?: string;
            link_type?: string;
            profile_sources?: string[];
        },
    ) {
        return <LinksResponse>(await this.main.utils.request(instance, '/notes', queries)).data;
    }
}

export default Notes;
