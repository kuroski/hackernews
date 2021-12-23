import {
  topStories,
  LoadList,
  Item,
  FetchError,
} from "@kuroski-hackernews/framework";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";
import { computed, ComputedRef, ref, Ref } from "vue-demi";

type UseStories = (_storiesPerPage?: number) => {
  remoteData: Ref<RD.RemoteData<FetchError, readonly Item.Item[]>>;
  stories: Ref<readonly Item.Item[]>;
  loadMore: ComputedRef<
    O.Option<() => Promise<RD.RemoteData<FetchError, readonly Item.Item[]>>>
  >;
};

export const useStories: UseStories = (storiesPerPage = 10) => {
  const remoteData = ref<RD.RemoteData<FetchError, readonly Item.Item[]>>(
    RD.initial
  );

  const next = ref<O.Option<() => LoadList>>(O.none);
  const stories = ref<readonly Item.Item[]>([]);

  const fetchStories = async (loadListFn: () => LoadList) => {
    remoteData.value = RD.pending;

    const result = await pipe(
      loadListFn(),
      TE.fold(
        (err) => T.of(RD.failure(err)),
        ([items, nextFn]) => {
          next.value = nextFn;
          stories.value = items;
          return T.of(RD.success(items));
        }
      )
    )();

    remoteData.value = result;

    return result;
  };

  fetchStories(() => topStories(storiesPerPage));

  return {
    remoteData,
    stories,
    loadMore: computed(() =>
      pipe(
        next.value,
        O.map((nextFn) => () => fetchStories(nextFn))
      )
    ),
  };
};
