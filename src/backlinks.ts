import Main from './index';

class Backlinks {
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
        return <LinksResponse>(await this.main.utils.request(instance, '/backlinks', queries)).data;
    }
}

export default Backlinks;
