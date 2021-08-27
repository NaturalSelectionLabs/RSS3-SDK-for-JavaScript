import type {
    RSS3Profile,
    RSS3Item,
    RSS3ItemInput,
    RSS3IContent,
    RSS3Links,
    RSS3Backlink,
    RSS3AccountInput,
    RSS3Account,
    RSS3Content,
    RSS3Asset,
} from './rss3';

declare module 'rss3-next' {
    class RSS3 {
        readonly files: {
            new (fileID: string): RSS3Content;
            get(fileID: string, force?: boolean): Promise<RSS3Content>;
            set(content: RSS3IContent): void;
            sync(): Promise<void>;
        };
        readonly account: {
            mnemonic: string | undefined;
            privateKey: string | undefined;
            address: string;
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
        readonly accounts: {
            get(fileID?: string): Promise<RSS3Account[]>;
            getSigMessage(account: RSS3AccountInput): string;
            post(account: RSS3Account): Promise<RSS3Account>;
            delete(account: { platform: string; identity: string }): Promise<{
                platform: string;
                identity: string;
            }>;
            patchTags(account: RSS3AccountInput, tags: string[]): Promise<RSS3Account>;
        };
        readonly assets: {
            get(fileID?: string): Promise<RSS3Asset[]>;
            patchTags(asset: RSS3Asset, tags: string[]): Promise<RSS3Asset>;
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
