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
        if (index < 0) {
            const indexFile = <RSS3Index>await this.main.files.get(persona);
            if (indexFile.backlinks) {
                const linksId = indexFile.backlinks.find((links) => links.type === type)?.list;
                if (!linksId) {
                    throw new Error('Backlink type does not exist');
                }
                const parsed = utils.id.parse(linksId);
                index = parsed.index + index + 1;
                return <RSS3List>await this.main.files.get(utils.id.getBacklinks(persona, type, index));
            } else {
                return null;
            }
        } else {
            return <RSS3List>await this.main.files.get(utils.id.getBacklinks(persona, type, index));
        }
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
