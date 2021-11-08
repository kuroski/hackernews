import { flow, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import * as ROR from "fp-ts/lib/ReadonlyRecord";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as ROT from "fp-ts/lib/ReadonlyTuple";
import * as RD from "@devexperts/remote-data-ts";
import { getLists, List, ListId } from "./List";
import { readonlyRecord } from "fp-ts";
import { getStory, Item, ItemStory } from "./Item";
import { error, log } from "fp-ts/lib/Console";
import { FetchError } from "./fetch";
import { IO } from "fp-ts/lib/IO";

export const topStories = (pageSize = 20) => {
  function tailFn(lists: List, itemsAcc: T.Task<readonly ItemStory[]>) {
    const [items, restList] = pipe(
      lists,
      ROA.splitAt(pageSize),
      ROT.mapFst((he) =>
        pipe(
          TE.sequenceArray(he.map(getStory)),
          TE.fold((e) => {
            error(e)();
            return T.of(ROA.empty);
          }, T.of),
          T.chain((result) => pipe(itemsAcc, T.map(ROA.concat(result))))
        )
      )
    );

    const next = () => tailFn(restList, items);
    return [items, next] as const;
  }

  return pipe(
    getLists,
    TE.map((lists) => tailFn(lists, T.of(ROA.empty)))
  );
};
