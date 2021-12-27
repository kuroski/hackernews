import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as ROA from "fp-ts/ReadonlyArray";
import * as ROT from "fp-ts/ReadonlyTuple";
import * as L from "./List";
import { getStory, Item } from "./Item";
import { FetchError } from "./fetch";

export type LoadList = TE.TaskEither<
  FetchError,
  readonly [readonly Item[], O.Option<() => LoadList>]
>;

export const topStories = (pageSize = 20): LoadList => {
  function loadList(lists: L.List, itemsAcc: readonly Item[]) {
    const [items, remainingList] = pipe(
      lists,
      ROA.splitAt(pageSize),
      ROT.mapFst((pageListIds) =>
        pipe(
          TE.sequenceArray(pageListIds.map(getStory)),
          TE.map((items) => pipe(itemsAcc, ROA.concat(items)))
        )
      )
    );

    return pipe(
      items,
      TE.map((result) => {
        const next = ROA.isEmpty(remainingList)
          ? O.none
          : O.some((): LoadList => loadList(remainingList, result));

        return [result, next] as const;
      })
    );
  }

  return pipe(
    L.getLists,
    TE.chain((lists) => loadList(lists, ROA.empty))
  );
};
