# Framework

Main package, to handle all Hackernews logic.

Hackernews works with Stories, we have to make:

- One HTTP request to get the list of top stories, which is an array of numbers
- One HTTP request for each story, passing by the ID of the story to get more details

- `index.ts`: main file that exposes public API / to generate declaration files
- `fetch.ts`: custom fetch implementation, using `cross-fetch` to support `node` and `browser` environments + to force `encoding/decoding`
- `hackernews.ts`: this file exposes the main API
- `codecs.ts`: custom codecs used in the project
- `List/*`
  - `List/api.ts`: endpoint communication service, here the `topStories` endpoint will be called
  - `List/List.ts`: General API, types, encoders, decoders definitions are here
- `Item/*`
  - `Item/api.ts`: endpoint communication service, here the `topStories` endpoint will be called
  - `Item/Item.ts`: General API, types, encoders, decoders definitions are here

# Usage

```sh
pnpm install @kuroski-hackernews/framework
```

```typescript
import { topStories } from "@kuroski-hackernews/framework";

const PAGE_SIZE = 20;

const topStoriesFetcher = topStories(PAGE_SIZE);

topStoriesFetcher().then(([items, nextFn]) => {
  console.log("First 20 items:", items);
});
```

# Dev

## Install

```sh
pnpm install
```

## Develop

To trigger watch mode, just:

```sh
pnpm watch
```

## Build

```sh
pnpm build
```

## Test

```sh
pnpm test
```
