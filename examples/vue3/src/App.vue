<script setup lang="ts">
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import {
  Item,
  topStories,
  fetchErrorToString,
  LoadList,
} from "@kuroski-hackernews/framework";
import type { FetchError } from "@kuroski-hackernews/framework";
import { onMounted, ref } from "vue";
import * as RD from "@devexperts/remote-data-ts";
import { RemoteData } from "vue-remote-data";
import Spinner from "./Spinner.vue";
import Story from "./Story.vue";

const PER_PAGE = 10;
const remoteData = ref<RD.RemoteData<FetchError, readonly Item.Item[]>>(
  RD.initial
);
const stories = ref<readonly Item.Item[]>([]);
const loadMore = ref<O.Option<() => LoadList>>(O.none);

onMounted(async () => {
  remoteData.value = RD.pending;
  remoteData.value = await pipe(
    topStories(PER_PAGE),
    TE.fold(
      (error) => {
        console.error(error);
        return T.of(RD.failure(error));
      },
      ([items, nextFn]) => {
        stories.value = items;
        loadMore.value = nextFn;
        return T.of(RD.success(items));
      }
    )
  )();
});

const fetchStories = async (loadListFn: () => LoadList) => {
  remoteData.value = RD.pending;

  const result = await pipe(
    loadListFn(),
    TE.fold(
      (err) => T.of(RD.failure(err)),
      ([items, nextFn]) => {
        loadMore.value = nextFn;
        stories.value = items;
        return T.of(RD.success(items));
      }
    )
  )();

  remoteData.value = result;

  return result;
};
</script>

<template>
  <div
    class="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-4"
  >
    <div class="stories">
      <h1>Top stories</h1>

      <div
        v-for="(item, index) in stories"
        :key="item.id.toString()"
        :style="{
          animationDelay: `${100 * (index % PER_PAGE)}ms`,
        }"
      >
        <Story :id="item.id.toString()" :item="item" />
      </div>

      <RemoteData :remote-data="remoteData">
        <template #initial><div>Nothing loaded yet</div></template>
        <template #pending>
          <div class="self-center mt-2">
            <Spinner />
          </div>
        </template>
        <template #failure="error: FetchError"
          ><div>{{ fetchErrorToString(error) }}</div></template
        >
        <template #success>
          <div v-if="O.isNone(loadMore)">All loaded up =D</div>
          <button
            v-else
            @click="O.isSome(loadMore) && fetchStories(loadMore.value)"
            class="button self-center"
          >
            Load More
          </button>
        </template>
      </RemoteData>
    </div>
  </div>
</template>
