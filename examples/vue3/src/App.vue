<script setup lang="ts">
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { FetchError, Item, topStories } from "@kuroski-hackernews/framework";
import { onMounted, ref } from "vue";
import * as RD from "@devexperts/remote-data-ts";

const remoteData = ref<RD.RemoteData<FetchError, readonly Item.Item[]>>(
  RD.initial
);

onMounted(async () => {
  remoteData.value = RD.pending;
  remoteData.value = await pipe(
    topStories(2),
    TE.fold(
      (error) => {
        console.error(error);
        return T.of(RD.failure(error));
      },
      ([items, nextFn]) => T.of(RD.success(items))
    )
  )();
});
</script>

<template>
  <div>Hello world</div>
</template>