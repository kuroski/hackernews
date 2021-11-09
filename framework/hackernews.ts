import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as ROT from "fp-ts/lib/ReadonlyTuple";
import * as L from "./List";
import { getStory, ItemStory } from "./Item";
import { error } from "fp-ts/lib/Console";

export const topStories = (pageSize = 20) => {
  function tailFn(lists: L.List, itemsAcc: readonly ItemStory[]) {
    const [items, remainingList] = pipe(
      lists,
      ROA.splitAt(pageSize),
      ROT.mapFst((pageListIds) =>
        pipe(
          TE.sequenceArray(pageListIds.map(getStory)),
          TE.map((items) => pipe(itemsAcc, ROA.concat(items))),
          TE.fold((e) => {
            error(e)();
            return T.of(ROA.empty);
          }, T.of)
        )
      )
    );

    return pipe(
      items,
      T.map((result) => [result, () => tailFn(remainingList, result)] as const)
    );
  }

  return pipe(
    L.getLists,
    TE.fold((e) => {
      error(e)();
      return T.of(L.empty);
    }, T.of),
    T.chain((lists) => tailFn(lists, ROA.empty))
  );
};
