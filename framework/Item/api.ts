import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { TList, fromTList, ListId } from "@framework/List";
import customFetch, { FetchError, mapTDecoded } from "@framework/fetch";
import { TItemStory } from ".";

export const ENDPOINTS = {
  story: (id: ListId) =>
    new URL(`https://hacker-news.firebaseio.com/v0/item/${id.toString()}.json`),
};

export const getStory = (id: ListId): TE.TaskEither<FetchError, TItemStory> =>
  pipe(id, ENDPOINTS.story, customFetch(TItemStory));
