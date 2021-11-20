import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { ListId } from "@framework/List";
import customFetch, { FetchError, mapTDecoded } from "@framework/fetch";
import { fromTItem, TItem, Item } from "@framework/Item";

export const ENDPOINTS = {
  story: (id: ListId) =>
    new URL(`https://hacker-news.firebaseio.com/v0/item/${id.toString()}.json`),
};

export const getStory = (id: ListId): TE.TaskEither<FetchError, Item> =>
  pipe(id, ENDPOINTS.story, customFetch(TItem), mapTDecoded(fromTItem));
