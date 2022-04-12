import Main from './index';

class Profiles {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(
        instance: string | Instance,
        queries?: {
            profile_sources?: string[];
        },
    ) {
        return <ProfilesResponse>(await this.main.utils.request(instance, '/profiles', queries)).data;
    }
}

export default Profiles;
