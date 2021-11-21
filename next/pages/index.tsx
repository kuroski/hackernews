import type { NextPage } from "next";
import { LoadList, topStories } from "@framework/hackernews";
import { useEffect, useMemo, useState } from "react";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import { pipe } from "fp-ts/lib/function";
import { Item } from "@framework/Item";
import * as RD from "@devexperts/remote-data-ts";
import { FetchError, fetchErrorToString } from "@framework/fetch";

const useStories = () => {
  const [pages, setPages] = useState(0);
  const [next, setNext] = useState<O.Option<() => LoadList>>(O.none);
  const [rd, setRd] = useState<RD.RemoteData<FetchError, readonly Item[]>>(
    RD.initial
  );

  const [stories, setStories] = useState<readonly Item[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      setRd(RD.pending);

      const result = await pipe(
        next,
        O.getOrElseW(() => topStories),
        (a) => a(2),
        TE.fold(
          (err) => T.of(RD.failure(err)),
          ([items, nextFn]) => {
            setNext(O.some(nextFn));
            setStories(items);
            return T.of(RD.success(items));
          }
        )
      )();

      setRd(result);
    };

    fetchStories();
  }, [pages]);

  return [rd, stories, () => setPages(pages + 1)] as const;
};

const Home: NextPage = () => {
  const [rd, stories, next] = useStories();

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
        rd,
        RD.fold(
          () => <div>Nothing loaded yet</div>,
          () => <div>Loading...</div>,
          (err) => <div>{fetchErrorToString(err)}</div>,
          (result) => (
            <button key="load-more" onClick={() => next()}>
              Load More...
            </button>
          )
        )
      )}
    </>
  );
};

export default Home;
