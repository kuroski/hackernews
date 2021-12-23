import {
  topStories as getTopStories,
  fetchErrorToString,
  Item,
} from "@kuroski-hackernews/framework";
import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";

export const perPage = t.number;
export type PerPage = t.TypeOf<typeof perPage>;

export const topStories = (perPage: PerPage): T.Task<readonly Item.Item[]> =>
  pipe(
    getTopStories(perPage),
    TE.fold(
      (err) => {
        console.error(fetchErrorToString(err));
        return T.of([]);
      },
      ([items, _nextFn]) => {
        return T.of(items);
      }
    )
  );
