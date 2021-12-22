<script setup lang="ts">
import * as O from "fp-ts/Option";
import { fetchErrorToString } from "@kuroski-hackernews/framework";
import type { FetchError } from "@kuroski-hackernews/framework";
import { useStories } from "@kuroski-hackernews/vue";
import { RemoteData } from "vue-remote-data";
import Spinner from "./Spinner.vue";
import Story from "./Story.vue";

const PER_PAGE = 10;
const { remoteData, stories, loadMore } = useStories(PER_PAGE);
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
        <template #failure="error: FetchError">
          <div>{{ fetchErrorToString(error) }}</div>
        </template>
        <template #success>
          <div v-if="O.isNone(loadMore)">All loaded up =D</div>
          <button
            v-else
            @click="O.isSome(loadMore) && loadMore.value()"
            class="button self-center"
          >
            Load More
          </button>
        </template>
      </RemoteData>
    </div>
  </div>
</template>
