import type { RSS3Profile, RSS3Item, RSS3ItemInput, RSS3ProfileInput } from './rss3';

declare module 'rss3' {
    class RSS3 {
        readonly persona: {
            privateKey: string;
            id: string;
            sync(): string[];
            raw(fileID?: string): string;
        };
        readonly profile: {
            get(personaID?: string): Promise<RSS3Profile>;
            patch(profile: RSS3ProfileInput): Promise<RSS3Profile>;
        };
        readonly item: {
            get(itemID: string): Promise<RSS3Item>;
            post(item: RSS3ItemInput): Promise<RSS3ItemInput>;
            patch(item: RSS3ItemInput): Promise<RSS3ItemInput>;
        };
        readonly items: {
            get(fileID?: string): Promise<{
                items: RSS3Item[];
                items_next?: string;
            }>;
        };

        constructor(options: { endpoint: string; privateKey?: string });
    }

    export default RSS3;
}
