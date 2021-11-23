import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as ROT from "fp-ts/lib/ReadonlyTuple";
import * as L from "@framework/List";
import { getStory, Item } from "@framework/Item";
import { FetchError } from "@framework/fetch";

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

export const topStoriesPaginated = (pageSize = 20) => {
  /**
   * pageSize = 2
   * [1, 2, 3, 4] => { 1: {story}, 2: {story}, 3: null, 4: null }
   * currentItems = [1, 2]
   *
   *
   * nextPage =
   * - check if we have it loaded
   * - yes? check for _latestUpdated
   * - no? fetch... then set _latestUpdated custom attr for 3 minutes - 1000 * 60 * 3 and add to list { 1: {story}, 2: {story}, 3: {story}, 4: {story} }
   * - set currentItems
   *
   * previousPage =
   * - check if we have it loaded
   * - yes? check for _latestUpdated
   * - no? fetch... then set _latestUpdated custom attr for 3 minutes - 1000 * 60 * 3 and add to list { 1: {story}, 2: {story}, 3: {story}, 4: {story} }
   * set currentItems
   *
   *
   * return TE.TaskEither<
   *  FetchError,
   *  {currentItems, nextPage, PreviousPage, currentPage, pageCount}
   * >
   *
   */
};
