# RSS3 SDK JavaScript

JavaScript SDK for [RSS3-Hub](https://github.com/NaturalSelectionLabs/RSS3-Hub)

## Quick Start

```ts
import RSS3 from 'rss3';

const rss3 = new RSS3({
    endpoint: 'https://rss3-hub-playground-6raed.ondigitalocean.app',
    privateKey:
        '0x47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba',
    callback: (persona) => {
        console.log(persona);

        rss3.profilePatch({
            name: 'RSS3',
        });
        rss3.itemPost({
            title: 'Hello',
        });
        rss3.syncFile();
    },
});
```
