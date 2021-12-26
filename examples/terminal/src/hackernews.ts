import {
  topStories as getTopStories,
  fetchErrorToString,
} from "@kuroski-hackernews/framework";
import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as ROTPL from "fp-ts/ReadonlyTuple";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

export const perPage = t.number;
export type PerPage = t.TypeOf<typeof perPage>;

export const ItemPage = t.type({
  title: t.readonly(t.string),
  url: t.readonly(t.string),
});
export type ItemPage = t.TypeOf<typeof ItemPage>;

export const ItemsPage = t.readonlyArray(ItemPage);
export type ItemsPage = t.TypeOf<typeof ItemsPage>;

export const topStories = (perPage: PerPage): T.Task<ItemsPage> =>
  pipe(
    getTopStories(perPage),
    TE.map(
      ROTPL.mapFst(
        (items): ItemsPage =>
          items.map((item) => ({
            title: pipe(
              item.title,
              O.alt(() => item.text),
              O.getOrElse(() => "-")
            ),
            url: pipe(
              item.url,
              O.map(String),
              O.getOrElse(() => "-")
            ),
          }))
      )
    ),
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
