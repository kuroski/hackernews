import type { NextPage } from "next";
import { LoadList, topStories } from "@framework/hackernews";
import { useEffect, useState } from "react";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { Item } from "@framework/Item";
import * as RD from "@devexperts/remote-data-ts";
import { FetchError, fetchErrorToString } from "@framework/fetch";

const useStories = () => {
  const [page, setPage] = useState(0);
  const [next, setNext] = useState<O.Option<() => LoadList>>(O.none);
  const [rd, setRd] = useState<RD.RemoteData<FetchError, readonly Item[]>>(
    RD.initial
  );

  useEffect(() => {
    const fetchStories = async () => {
      setRd(RD.pending);

      const result = await pipe(
        next,
        O.getOrElseW(() => topStories),
        (a) => a(2),
        // topStories(),
        TE.fold(
          (e) => T.of(RD.failure(e)),
          ([a, n]) => {
            setNext(O.some(n));
            return T.of(RD.success(a));
          }
        )
      )();

      setRd(result);
    };

    fetchStories();
  }, [page]);

  return [rd, () => setPage(page + 1)] as const;
};

const Home: NextPage = () => {
  const [rd, next] = useStories();

  // const n = pipe(
  //   next,
  //   O.map((actual) => (
  //     <button key="load-more" onClick={() => actual()}>
  //       Load More...
  //     </button>
  //   )),
  //   O.getOrElseW(() => <div>Nothing to load</div>)
  // );

  return pipe(
    rd,
    RD.fold(
      () => <div>Nothing loaded yet</div>,
      () => <div>Loading...</div>,
      (err) => <div>{fetchErrorToString(err)}</div>,
      (result) => (
        <ul>
          {result.map((i) => (
            <li key={i.id.toString()}>
              <span>{JSON.stringify(i.text)}</span>
              <small>{JSON.stringify(i.url)}</small>
            </li>
          ))}
          {/* <li>{n}</li> */}
          <li>
            <button key="load-more" onClick={() => next()}>
              Load More...
            </button>
          </li>
        </ul>
      )
    )
  );
};

export default Home;
