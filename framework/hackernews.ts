import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as ROT from "fp-ts/lib/ReadonlyTuple";
import * as L from "./List";
import { getStory, ItemStory } from "./Item";
import { FetchError } from "./fetch";

export type TailFn = TE.TaskEither<
  FetchError,
  readonly [readonly ItemStory[], () => TailFn]
>;

export const topStories = (pageSize = 20) => {
  function tailFn(lists: L.List, itemsAcc: readonly ItemStory[]) {
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
      TE.map(
        (result) =>
          [result, (): TailFn => tailFn(remainingList, result)] as const
      )
    );
  }

  return pipe(
    L.getLists,
    TE.chain((lists) => tailFn(lists, ROA.empty))
  );
};
