import Main from './index';
import utils from './utils';

class Backlinks {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    private async getPosition(persona: string, type: string) {
        const file = <RSS3Index>await this.main.files.get(persona);
        const index = (file.backlinks || []).findIndex((lks) => lks.type === type);
        return {
            file,
            index,
            id: index !== -1 ? file.backlinks![index].list : null,
        };
    }

    async getListFile(persona: string, type: string, index = -1) {
        return <RSS3BacklinksList | null>await this.main.files.getList(persona, 'backlinks', index, type);
    }

    async getList(persona: string, type: string, breakpoint?: (file: RSS3BacklinksList) => boolean) {
        const { id } = await this.getPosition(persona, type);
        if (id) {
            return <RSS3ID[]>await this.main.files.getAll(id, (file) => {
                return breakpoint?.(<RSS3BacklinksList>file) || false;
            });
        } else {
            return [];
        }
    }
}

export default Backlinks;
