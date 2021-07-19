# RSS3 SDK JavaScript

JavaScript SDK for [RSS3-Hub](https://github.com/NaturalSelectionLabs/RSS3-Hub)

## Install

```bash
npm install rss3 --save
```

or

```bash
yarn add rss3
```

```js
import RSS3 from 'rss3';
```

or

```js
const RSS3 = require('rss3').default;
```

## API

### Initialization

```ts
new RSS3(options: {
    endpoint: string; // RSS3 Hub Address
    privateKey?: string; // Persona's private key, a new persona will be created if it is empty
})
```

Example:

```ts
const rss3 = new RSS3({
    endpoint: 'https://rss3-hub-playground-6raed.ondigitalocean.app',
    privateKey: '0x47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba',
});
```

### Persona

**persona.privateKey**

```ts
persona.privateKey: string
```

Example:

```ts
const privateKey = rss3.persona.privateKey;
```

**persona.id**

```ts
persona.id: string
```

Example:

```ts
const id = rss3.persona.id;
```

**persona.sync()**

Please note that changes will only be synced to the node after `persona.sync()` is successfully executed

```ts
persona.sync(): string[]
```

Example:

```ts
const changedFiles = rss3.persona.sync();
```

**persona.raw()**

```ts
persona.raw(fileID: string = persona.id): Promise<RSS3IContent>
```

Example:

```ts
const file = await rss3.persona.raw();
```

### Profile

**profile.get()**

```ts
profile.get(personaID: string = persona.id): Promise<RSS3Profile>
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

### Items

**items.get()**

```ts
items.get(fileID: string = persona.id): Promise<{
    items: RSS3Item[],
    items_next?: string,
}>
```

Example:

```ts
const list1 = await rss3.items.get();
const items1 = list1.items;
const list2 = await rss3.items.get(list1.items_next);
const items2 = list2.items;
```

### Item

**item.get**

```ts
item.get(itemID: string): Promise<RSS3Item>
```

Example:

```ts
const item = await rss3.item.get('0x47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba-item-0');
```

**item.post**

```ts
item.post(item: RSS3ItemInput): Promise<RSS3ItemInput>
```

Example:

```ts
const item = await rss3.item.post({
    title: 'Hello RSS3',
    summary: 'RSS3 is an open protocol designed for content and social networks in the Web 3.0 era.',
});
```

**item.patch**

```ts
item.patch(item: RSS3ItemInput): Promise<RSS3ItemInput>
```

Example:

```ts
const newItem = await rss3.item.patch({
    title: 'Hi RSS3',
});
```

### Links

**links.get**

```ts
links.get(fileID: string): Promise<RSS3Links[]>;
links.get(fileID: string, type: string): Promise<RSS3Links>;
```

Example:

```ts
const following = await rss3.links.get(rss3.persona.id, 'following');
```

**links.post**

```ts
links.post(links: RSS3LinksInput): Promise<RSS3Links>
```

Example:

```ts
const following = await rss3.links.post({
    type: 'following',
    list: ['0xd0B85A7bB6B602f63B020256654cBE73A753DFC4'],
});
```

**links.delete**

```ts
links.delete(type: string): Promise<RSS3Links>
```

Example:

```ts
const following = await rss3.links.delete('following');
```

**links.patch**

```ts
links.patch(links: RSS3LinksInput): Promise<RSS3Links>
```

Example:

```ts
const following = await rss3.links.patch({
    type: 'following',
    tags: ['test'],
    list: ['0xd0B85A7bB6B602f63B020256654cBE73A753DFC4', '0xC8b960D09C0078c18Dcbe7eB9AB9d816BcCa8944'],
});
```

### Link

**link.post**

```ts
link.post(type: string, personaID: string): Promise<RSS3Links>
```

Example:

```ts
const following = await rss3.link.post('following', '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4');
```

**link.delete**

```ts
link.delete(type: string, personaID: string): Promise<RSS3Links>
```

Example:

```ts
const following = await rss3.link.delete('following', '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4');
```

### Backlinks

**backlinks.get**

```ts
backlinks.get(personaID?: string): Promise<RSS3Backlink[]>
backlinks.get(personaID: string, type: string): Promise<string[]>
```

Example:

```ts
const followers = await rss3.backlinks.get(rss3.persona.id, 'following');
```
