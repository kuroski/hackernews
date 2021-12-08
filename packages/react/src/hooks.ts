import { topStories } from "@kuroski-hackernews/framework";
import { LoadList } from "@kuroski-hackernews/framework/src/hackernews";
import { Item } from "@kuroski-hackernews/framework/src/Item";
import { FetchError } from "@kuroski-hackernews/framework/src/fetch";
import { useCallback, useEffect, useState } from "react";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as RD from "@devexperts/remote-data-ts";

export const useStories = (storiesPerPage = 10) => {
  const [remoteData, setRemoteData] = useState<
    RD.RemoteData<FetchError, readonly Item[]>
  >(RD.initial);

  const [next, setNext] = useState<O.Option<() => LoadList>>(O.none);
  const [stories, setStories] = useState<readonly Item[]>([]);

  const fetchStories = useCallback(async (loadListFn: () => LoadList) => {
    setRemoteData(RD.pending);

    const result = await pipe(
      loadListFn(),
      TE.fold(
        (err) => T.of(RD.failure(err)),
        ([items, nextFn]) => {
          setNext(nextFn);
          setStories(items);
          return T.of(RD.success(items));
        }
      )
    )();

    setRemoteData(result);

    return result;
  }, []);

  useEffect(() => {
    fetchStories(() => topStories(storiesPerPage));
  }, [fetchStories, storiesPerPage]);

  return {
    remoteData,
    stories,
    loadMore: pipe(
      next,
      O.map((nextFn) => () => fetchStories(nextFn))
    ),
  };
};
