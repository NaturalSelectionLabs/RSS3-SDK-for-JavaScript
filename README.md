# RSS3 SDK JavaScript

JavaScript SDK for [RSS3-Hub](https://github.com/NaturalSelectionLabs/RSS3-Hub)

## Quick Start

### Install

```bash
npm install rss3 --save
```

or

```bash
yarn add rss3
```

### Demo

```ts
import RSS3 from 'rss3';

const rss3 = new RSS3({
    endpoint: 'https://rss3-hub-playground-6raed.ondigitalocean.app',
    privateKey: '0x47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba',
});

await rss3.profilePatch({
    name: 'RSS3',
    avatar: 'https://cloudflare-ipfs.com/ipfs/QmZWWSspbyFtWpLZtoAK35AjEYK75woNawqLgKC4DRpqxu',
    bio: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
await rss3.itemPost({
    title: 'Hello RSS3',
    summary: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
await rss3.itemPatch({
    id: rss3.address + '-item-0',
    title: 'Hi RSS3',
});

await rss3.syncFile();
```

## API

### Initialization

```ts
const persona = new RSS3({
    endpoint: 'https://rss3-hub.example',
    privateKey: '0x.....',
    callback: (persona) => {
        console.log(persona);
    },
});
```

Options:

```ts
config: {
    endpoint: string; // RSS3 Hub Address
    privateKey?: string; // Persona's private key, a new persona will be created if it is empty
    callback?: (persona) => void; // Initialization callback
}
```

### ProfilePatch

```ts
await rss3.profilePatch({
    name: 'RSS3',
    avatar: 'https://cloudflare-ipfs.com/ipfs/QmZWWSspbyFtWpLZtoAK35AjEYK75woNawqLgKC4DRpqxu',
    bio: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

Options:

```ts
profile: {
    name?: string;
    avatar?: ThirdPartyAddress;
    bio?: string;
    tags?: string[];
}
```

### ItemPost

```ts
await rss3.itemPost({
    title: 'Hello RSS3',
    summary: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

Options:

```ts
item: {
    authors?: RSS3ID[];
    title?: string;
    summary?: string;
    tags?: string[];

    type?: string;
    upstream?: RSS3ItemID;

    contents?: {
        address: ThirdPartyAddress;
        mime_type: string;
        name?: string;
        tags?: string[];
        size_in_bytes?: string;
        duration_in_seconds?: string;
    }[];
}
```

### ItemPatch

```ts
await rss3.itemPatch({
    id: rss3.address + '-item-0',
    title: 'Hi RSS3',
});
```

Options:

```ts
item: {
    id: string;
    authors?: RSS3ID[];
    title?: string;
    summary?: string;
    tags?: string[];

    type?: string;
    upstream?: RSS3ItemID;

    contents?: {
        address: ThirdPartyAddress;
        mime_type: string;
        name?: string;
        tags?: string[];
        size_in_bytes?: string;
        duration_in_seconds?: string;
    }[];
}
```

### SyncFile

```ts
await rss3.syncFile();
```

### GetFile

```ts
await rss3.getFile(rss3.address.items_next);
```

Options:

```ts
fileID: string;
```

### DeleteFile

```ts
await rss3.deleteFile(rss3.address);
```

Options:

```ts
personaID: string;
```
