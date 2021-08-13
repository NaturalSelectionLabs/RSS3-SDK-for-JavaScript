import type { RSS3Profile, RSS3Item, RSS3ItemInput, RSS3IContent, RSS3Links, RSS3Backlink } from './rss3';

declare module 'rss3' {
    class RSS3 {
        readonly persona: {
            privateKey: string;
            id: string;
            sync(): Promise<void>;
            raw(fileID?: string): Promise<RSS3IContent>;
        };
        readonly profile: {
            get(personaID?: string): Promise<RSS3Profile>;
            patch(profile: RSS3Profile): Promise<RSS3Profile>;
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
        readonly link: {
            post(type: string, personaID: string): Promise<RSS3Links>;
            delete(type: string, personaID: string): Promise<RSS3Links>;
        };
        readonly links: {
            get(fileID: string): Promise<RSS3Links[]>;
            get(fileID: string, type: string): Promise<RSS3Links>;
            post(links: RSS3Links): Promise<RSS3Links>;
            delete(type: string): Promise<RSS3Links>;
            patch(links: RSS3Links): Promise<RSS3Links>;
        };
        readonly backlinks: {
            get(personaID?: string): Promise<RSS3Backlink[]>;
            get(personaID: string, type: string): Promise<string[]>;
        };

        constructor(
            options:
                | {
                      endpoint: string;
                      privateKey?: string;
                  }
                | {
                      endpoint: string;
                      address: string;
                      sign: (data: string) => Promise<string>;
                  },
        );
    }

    export default RSS3;
}
