import {
  topStories,
  LoadList,
  Item,
  FetchError,
} from "@kuroski-hackernews/framework";
import { useCallback, useEffect, useState } from "react";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";

export const useStories = (storiesPerPage = 10) => {
  const [remoteData, setRemoteData] = useState<
    RD.RemoteData<FetchError, readonly Item.Item[]>
  >(RD.initial);

  const [next, setNext] = useState<O.Option<() => LoadList>>(O.none);
  const [stories, setStories] = useState<readonly Item.Item[]>([]);

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
