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
import { getStory, Item } from "./Item";
import { error, log } from "fp-ts/lib/Console";
import { FetchError } from "./fetch";
import { IO } from "fp-ts/lib/IO";

export const topStories = (pageSize = 20) => {
  async function tailFn(
    lists: List,
    itemsAcc: ROR.ReadonlyRecord<ListId & string, Item>
  ) {
    // console.log(lists);

    const [fst, scnd] = pipe(
      lists, // start with lists
      ROA.splitAt(pageSize), // split into a (Tuple arrPageSize rest)
      ROT.mapFst((he) => {
        // map pagination items and fetch them
        console.log(he);
        return TE.sequenceArray(he.map(getStory));
      }),
      (a) => a
    );

    console.log(fst);

    const r = await fst();
    console.log(r);

    // destructure lists first 20 items and ...rest
    // fetch each item
    // To avoid tail call in this case, because we don't want to recursively fetch everything
    // wrap the next call into a function, and return the new itemsAcc for people to use
    //
    // In the "next" function, make the recursive call for the "next page"
    // return tailFn with new "lists" variable (using ...rest)
    // return the itemsAcc with the results from the request
    return pipe(lists, log);
  }

  return pipe(
    getLists,
    TE.map((lists) => tailFn(lists, ROR.empty))
  );

  // const lists = await pipe(
  //   getLists,
  //   TE.fold(
  //     (e) => {
  //       error(e)();
  //       return T.of(ROA.empty);
  //     },
  //     (lists) => T.of(lists)
  //   )
  // )();

  // return tailFn(lists, ROR.empty);
};

// const paginatedStoriesFn = topStories()
// const [first20, next] = paginatedStoriesFn()
// const [next20, next] = next()

// const paginatedStoriesFn = topStories()
// const first20 = paginatedStoriesFn()
// const next20 = pa

// const paginatedStoriesFn = topStories()
// const (Tuple items nextPage) = paginatedStoriesFn()
// const (Tuple nextItems nextPage2) = nextPage()
