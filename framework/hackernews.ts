import { flow, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as ROR from "fp-ts/lib/ReadonlyRecord";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as RD from "@devexperts/remote-data-ts";
import { getLists, ListId } from "./List";
import { readonlyRecord } from "fp-ts";
import { Item } from "./Item";
import { error, log } from "fp-ts/lib/Console";

const aFn = (list: ROR.ReadonlyRecord<ListId & string, Item>) => {};

export const topStories = async (pageSize = 20) => {
  const stories = ROR.empty;
  const stories2 = ROR.upsertAt("a", 5)(stories);
  console.log(stories);
  console.log(stories2);

  const lists = await pipe(
    getLists,
    TE.fold(
      (e) => {
        error(e)();
        return T.of(ROA.empty);
      },
      (lists) => T.of(lists)
    )
  )();

  // console.log(lists);

  return pipe(lists, log);
};

// const paginatedStoriesFn = topStories()
// const [first20, next] = paginatedStoriesFn()
// const [next20, next] = next()

// const paginatedStoriesFn = topStories()
// const first20 = paginatedStoriesFn()
// const next20 = paginatedStoriesFn()
