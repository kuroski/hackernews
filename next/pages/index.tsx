import type { NextPage } from "next";
import { LoadList, topStories } from "@framework/hackernews";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { apply, constant, identity, pipe } from "fp-ts/lib/function";
import { Item } from "@framework/Item";
import * as RD from "@devexperts/remote-data-ts";
import { FetchError, fetchErrorToString } from "@framework/fetch";

const useStories = () => {
  const [next, setNext] = useState<O.Option<() => LoadList>>(O.none);
  const [remoteData, setRemoteData] = useState<
    RD.RemoteData<FetchError, readonly Item[]>
  >(RD.initial);
  const [stories, setStories] = useState<readonly Item[]>([]);

  const fetchStories = useCallback(async (n: () => LoadList) => {
    setRemoteData(RD.pending);

    const result = await pipe(
      n(),
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
  }, []);

  useEffect(() => {
    fetchStories(() => topStories(2));
  }, [fetchStories]);

  const nextFn = useMemo(
    () =>
      pipe(
        next,
        O.map((nextFn) => () => fetchStories(nextFn))
      ),
    [fetchStories, next]
  );

  return {
    remoteData,
    stories,
    nextFn,
  };
};

const Home: NextPage = () => {
  const { remoteData, stories, nextFn } = useStories();

  return (
    <>
      <ul>
        {stories.map((i) => (
          <li key={i.id.toString()}>
            <span>{JSON.stringify(i.text)}</span>
            <small>{JSON.stringify(i.url)}</small>
          </li>
        ))}
      </ul>

      {pipe(
        remoteData,
        RD.fold(
          () => <div>Nothing loaded yet</div>,
          () => <div>Loading...</div>,
          (err) => <div>{fetchErrorToString(err)}</div>,
          (_result) =>
            pipe(
              nextFn,
              O.match(
                () => <div>All loaded up =D</div>,
                (next) => (
                  <button key="load-more" onClick={next}>
                    Load More...
                  </button>
                )
              )
            )
        )
      )}
    </>
  );
};

export default Home;
