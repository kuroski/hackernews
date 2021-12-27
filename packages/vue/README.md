# Vue

Port of `framework` package to a vue hook.

# Usage

```sh
pnpm install @kuroski-hackernews/vue
```

### Example

```vue
<script setup lang="ts">
import * as O from "fp-ts/Option";
import { RemoteData } from "vue-remote-data";
import { useStories, fetchErrorToString } from "@kuroski-hackernews/vue";

const PER_PAGE = 10;
const { remoteData, stories, loadMore } = useStories(PER_PAGE);
</script>

<template>
  <div>
    <h1>Top stories</h1>

    <div v-for="(item, index) in stories" :key="item.id.toString()">
      <Story :id="item.id.toString()" :item="item" />
    </div>

    <RemoteData :remote-data="remoteData">
      <template #initial><div>Nothing loaded yet</div></template>
      <template #pending>
        <div>Loading...</div>
      </template>
      <template #failure="error: FetchError">
        <div>{{ fetchErrorToString(error) }}</div>
      </template>
      <template #success>
        <div v-if="O.isNone(loadMore)">All loaded up =D</div>
        <button v-else @click="O.isSome(loadMore) && loadMore.value()">
          Load More
        </button>
      </template>
    </RemoteData>
  </div>
</template>
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
