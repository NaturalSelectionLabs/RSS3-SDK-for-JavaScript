import Main from './index';

class Links {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(
        instance: string | Instance,
        queries: {
            type?: string;
            limit?: number;
            last_time?: string;
            to?: string;
            link_sources?: string[];
            profile_sources?: string[];
        },
    ) {
        return <LinksResponse>(await this.main.utils.request(instance, '/links', queries)).data;
    }
}

export default Links;
