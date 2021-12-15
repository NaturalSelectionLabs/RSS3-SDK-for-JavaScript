<p align="center">
<img src="https://rss3.mypinata.cloud/ipfs/QmUG6H3Z7D5P511shn7sB4CPmpjH5uZWu4m5mWX7U3Gqbu" alt="RSS3" width="300">
</p>
<h1 align="center">RSS3 SDK for JavaScript</h1>

JavaScript SDK for [RSS3-Hub](https://github.com/NaturalSelectionLabs/RSS3-Hub)

Compatible with v0.3.1 of [RSS3 protocol](https://github.com/NaturalSelectionLabs/RSS3)

[![test](https://github.com/NaturalSelectionLabs/RSS3-SDK-for-JavaScript/actions/workflows/test.yml/badge.svg)](https://github.com/NaturalSelectionLabs/RSS3-SDK-for-JavaScript/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/NaturalSelectionLabs/RSS3-SDK-for-JavaScript/branch/develop/graph/badge.svg?token=361AKFS8AH)](https://codecov.io/gh/NaturalSelectionLabs/RSS3-SDK-for-JavaScript)

## Install

```bash
yarn add rss3
```

```js
import RSS3 from 'rss3';
```

## Usage

### Initialization

There are 4 ways to initialize the sdk

-   Initialize with external signature method (recommended)
-   create a brand new account
-   Initialize with mnemonic
-   Initialize with private key

For security reasons, unless there is a specific need, you should initialize with external signature method provided by the wallet or secure device.

And `agentSign` is a kind of agent signature, its principle can refer to the `agent_id` and `agent_signature` field in [RSS3 protocol](https://github.com/NaturalSelectionLabs/RSS3), the function is that the user only needs to sign when the first change, subsequent changes use agent signature, only need to save the agent information in a suitable and save place through the `agentStorage` parameter, the default behavior is saved in the cookie

```ts
interface IOptions {
    endpoint: string; // RSS3 network endpoint
    agentSign?: boolean;
    agentStorage?: {
        set: (key: string, value: string) => Promise<void>;
        get: (key: string) => Promise<string>;
    };
}

export interface IOptionsMnemonic extends IOptions {
    mnemonic?: string;
    mnemonicPath?: string;
}

export interface IOptionsPrivateKey extends IOptions {
    privateKey: string;
}

export interface IOptionsSign extends IOptions {
    address: string;
    sign: (data: string) => Promise<string>;
}

new RSS3(options: IOptionsMnemonic | IOptionsPrivateKey | IOptionsSign);
```

Example:

**MetaMask or other ethereum compatible wallet**

ethers

```ts
import RSS3 from 'rss3';
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const rss3 = new RSS3({
    endpoint: '',
    address: await signer.getAddress(),
    sign: async (data) => await signer.signMessage(data),
});
```

web3.js

```ts
import RSS3 from 'rss3';
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);
const address = (await web3.eth.getAccounts())[0];
const rss3 = new RSS3({
    endpoint: '',
    address,
    sign: async (data) => await web3.eth.personal.sign(data, address),
});
```

**Brand new account**

```ts
const rss3 = new RSS3({
    endpoint: '',
});
```

**Mnemonic**

```ts
const rss3 = new RSS3({
    endpoint: '',
    mnemonic: 'xxx',
    mnemonicPath: 'xxx',
});
```

**PrivateKey**

```ts
const rss3 = new RSS3({
    endpoint: '',
    privateKey: '0xxxx',
});
```

### Files

**files.sync()**

Please note that changes will only be synced to the node after `files.sync()` is successfully executed

```ts
files.sync(): string[]
```

Example:

```ts
const changedFiles = rss3.files.sync();
```

**files.get()**

```ts
files.get(fileID: string): Promise<RSS3Content>
```

Example:

```ts
const file = await rss3.files.get(rss3.account.address);
```

### Account

**account.mnemonic**

If initialized with privateKey or custom sign function, then this value is undefined

```ts
account.mnemonic: string | undefined
```

**account.privateKey**

If initialized with custom sign function, then this value is undefined

```ts
account.privateKey: string | undefined
```

**account.address**

```ts
account.address: string
```

### Profile

**profile.get()**

```ts
profile.get(personaID: string = account.address): Promise<RSS3Profile>
```

Example:

```ts
const profile = rss3.profile.get();
```

**profile.patch()**

```ts
profile.patch(profile: RSS3Profile): Promise<RSS3Profile>
```

Example:

```ts
const newProfile = await rss3.profile.patch({
    name: 'RSS3',
    avatar: 'https://cloudflare-ipfs.com/ipfs/QmZWWSspbyFtWpLZtoAK35AjEYK75woNawqLgKC4DRpqxu',
    bio: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

**profile.getList()**

```ts
profile.get(personas: string[]): Promise<(RSS3Profile & { persona: string })[]>
```

Example:

```ts
const profiles = rss3.profile.getList([
    '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944',
    '0xee8fEeb6D0c2fC02Ef41879514A75d0E791b5061',
]);
```

### Profile.accounts

**profile.accounts.getSigMessage()**

```ts
profile.accounts.getSigMessage(account: RSS3Account): Promise<string>
```

Example:

```ts
const sigMessage = await rss3.profile.accounts.getSigMessage({
    id: utils.id.getAccount('EVM+', '0x1234567890123456789012345678901234567890'),
    tags: ['test'],
});
```

**profile.accounts.getList()**

```ts
profile.accounts.getList(persona?: string): Promise<RSS3Account[]>
```

Example:

```ts
const list = await rss3.profile.accounts.getList('0x1234567890123456789012345678901234567890');
```

**profile.accounts.post()**

```ts
profile.accounts.post(account: RSS3Account): Promise<RSS3Account>
```

Example:

```ts
import { utils } from 'rss3';

const account = {
    id: utils.id.getAccount('EVM+', '0x1234567890123456789012345678901234567890'),
    tags: ['test'],
};
const signature = mySignFun(await rss3.profile.accounts.getSigMessage(account));
account.signature = signature;
const account = await rss3.profile.accounts.post(account);
```

**profile.accounts.delete()**

```ts
profile.accounts.delete(id: string): Promise<string>
```

Example:

```ts
const account = await rss3.profile.accounts.delete(
    utils.id.getAccount('EVM+', '0x1234567890123456789012345678901234567890'),
);
```

### Items

**items.getListByPersona()**

```ts
items.getListByPersona(options: {
    limit: number;
    tsp: string;
    persona: string;
    linkID?: string;
    fieldLike?: string;
}): Promise<(RSS3CustomItem | RSS3AutoItem)[]>
```

Example:

```ts
const followingTimeline = await rss3.items.getListByPersona({
    persona: '0x1234567890123456789012345678901234567890',
    linkID: 'following',
    limit: 10;
    tsp: '2021-12-06T13:59:57.030Z',
});
const personaTimeline = await rss3.items.getListByPersona({
    persona: '0x1234567890123456789012345678901234567890',
    limit: 10;
    tsp: '2021-12-06T13:59:57.030Z',
});
```

### Items.auto

**items.auto.getListFile()**

```ts
items.auto.getListFile(persona: string, index?: number): Promise<RSS3AutoItemsList | null>
```

Example:

```ts
const items = await rss3.items.auto.getListFile(rss3.account.address, -1);
```

**items.auto.getList()**

```ts
items.auto.getList(persona: string, breakpoint?: (file: RSS3AutoItemsList) => boolean): Promise<RSS3AutoItem[]>
```

Example:

```ts
const autoItems = await rss3.auto.items.getList('0x1234567890123456789012345678901234567890');
```

**items.auto.backlinks.getListFile()**

**items.auto.backlinks.getList()**

### Items.custom

**items.custom.getListFile()**

```ts
items.custom.getListFile(persona: string, index?: number): Promise<RSS3CustomItemsList | null>
```

Example:

```ts
const items = await rss3.items.custom.getListFile(rss3.account.address, -1);
```

**items.custom.getList()**

```ts
items.custom.getList(persona: string, breakpoint?: (file: RSS3AutoItemsList) => boolean): Promise<RSS3AutoItem[]>
```

Example:

```ts
const customItems = await rss3.custom.items.getList('0x1234567890123456789012345678901234567890');
```

**item.custom.post()**

```ts
item.custom.post(itemIn: Omit<RSS3CustomItem, 'id' | 'date_created' | 'date_updated'>): Promise<RSS3CustomItem>
```

Example:

```ts
const item = await rss3.custom.item.post({
    title: 'Hello RSS3',
    summary: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

**item.custom.patch**

```ts
item.custom.patch(item: Partial<RSS3CustomItem> & {
    id: RSS3CustomItemID;
}): Promise<RSS3CustomItem | null>
```

Example:

```ts
const newItem = await rss3.item.custom.patch({
    id: '0x1234567890123456789012345678901234567890-item-custom-0',
    title: 'Hi RSS3',
});
```

**items.custom.backlinks.getListFile()**

**items.custom.backlinks.getList()**

### Links

**links.getListFile()**

```ts
links.getListFile(persona: string, id: string, index?: number): Promise<RSS3LinksList | null>
```

Example:

```ts
const followers = await rss3.links.getListFile(rss3.account.address, 'following', -1);
```

**links.getList()**

```ts
links.getList(persona: string, id: string, breakpoint?: ((file: RSS3LinksList) => boolean) | undefined): Promise<string[]>
```

Example:

```ts
const following = await rss3.links.getList(rss3.account.address, 'following');
```

**links.postList()**

```ts
links.postList(links: {
    tags?: string[];
    id: string;
    list?: RSS3ID[];
}): Promise<{
    tags?: string[];
    id: string;
    list?: RSS3ID[];
}>
```

Example:

```ts
const following = await rss3.links.postList({
    id: 'following',
    list: ['0xd0B85A7bB6B602f63B020256654cBE73A753DFC4'],
});
```

**links.deleteList()**

```ts
links.deleteList(id: string): Promise<{
    tags?: string[] | undefined;
    id: string;
    list?: string | undefined;
} | undefined>
```

Example:

```ts
const following = await rss3.links.deleteList('following');
```

**links.patchListTags()**

```ts
links.patchListTags(id: string, tags: string[]): Promise<{
    tags?: string[] | undefined;
    id: string;
    list?: string | undefined;
}>
```

Example:

```ts
const following = await rss3.links.patchListTags('following', ['test']);
```

**links.post()**

```ts
links.post(id: string, personaID: string): Promise<RSS3LinksList | undefined>
```

Example:

```ts
const following = await rss3.links.post('following', '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4');
```

**links.delete()**

```ts
links.delete(id: string, personaID: string): Promise<string[] | null>
```

Example:

```ts
const following = await rss3.links.delete('following', '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4');
```

### Backlinks

**backlinks.getListFile()**

```ts
backlinks.getListFile(persona: string, id: string, index?: number): Promise<RSS3BacklinksList | null>
```

Example:

```ts
const followers = await rss3.backlinks.getListFile(rss3.account.address, 'following', -1);
```

**backlinks.getList()**

```ts
backlinks.getList(persona: string, id: string, breakpoint?: ((file: RSS3BacklinksList) => boolean) | undefined): Promise<string[]>
```

Example:

```ts
const followers = await rss3.backlinks.getList(rss3.account.address, 'following');
```

### Assets

**assets.getDetails()**

```ts
assets.getDetails(options: {
    assets: string[];
    full?: boolean;
}): Promise<AnyObject[]>
```

Example:

```ts
const details = await rss3.assets.getDetails({
    assets: ['xxx', 'xxx'],
    full: true,
});
```

### Assets.auto

**assets.auto.getListFile()**

```ts
assets.auto.getListFile(persona: string, index?: number): Promise<RSS3AutoAssetsList | null>
```

Example:

```ts
const assets = await rss3.assets.auto.getListFile(rss3.account.address, -1);
```

**assets.auto.getList()**

```ts
assets.auto.getList(persona: string, breakpoint?: (file: RSS3AutoAssetsList) => boolean): Promise<RSS3AutoAsset[]>
```

Example:

```ts
const autoAssets = await rss3.auto.assets.getList('0x1234567890123456789012345678901234567890');
```

### Assets.custom

**assets.custom.getListFile()**

```ts
assets.custom.getListFile(persona: string, index?: number): Promise<RSS3AutoAssetsList | null>
```

Example:

```ts
const assets = await rss3.assets.custom.getListFile(rss3.account.address, -1);
```

**assets.custom.getList()**

```ts
assets.custom.getList(persona: string, breakpoint?: (file: RSS3CustomAssetsList) => boolean): Promise<RSS3CustomAsset[]>
```

Example:

```ts
const customAssets = await rss3.custom.assets.getList('0x1234567890123456789012345678901234567890');
```

**asset.custom.post()**

```ts
asset.custom.post(asset: RSS3CustomAsset): Promise<RSS3CustomAsset>
```

Example:

```ts
const asset = await rss3.custom.asset.post('custom-gk-q-10035911');
```

**asset.custom.delete**

```ts
asset.custom.delete(asset: RSS3CustomAsset): Promise<RSS3CustomAsset[] | undefined>
```

Example:

```ts
const otherAsset = await rss3.asset.custom.delete('custom-gk-q-10035911');
```

## Development

```bash
yarn
yarn dev
```

Open http://localhost:8080/demo/

Test

```bash
yarn test
```
