<script lang="ts" setup>
import * as O from "fp-ts/Option";
import { Item } from "@kuroski-hackernews/framework";
import { pipe } from "fp-ts/function";
import { computed, PropType } from "vue";

const props = defineProps({
  id: String,
  item: {
    type: Object as PropType<Item.Item>,
    required: true,
  },
});

const title = computed(() =>
  pipe(
    props.item.title,
    O.getOrElse(() => "-")
  )
);

const type = computed(() =>
  pipe(
    props.item,
    Item.fold(
      () => "story",
      () => "job"
    )
  )
);
</script>

<template>
  <section>
    <template v-if="O.isSome(props.item.url)">
      <a :href="props.item.url.value.toString()">{{ title }}</a>
      <small class="text-xs md:text-sm opacity-80">
        {{ `- ${props.item.url.value.hostname}` }}
      </small>
    </template>
    <span v-else>{{ title }}</span>
    <div class="text-xs">{{ type }}</div>
  </section>
</template>
