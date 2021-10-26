import { pipe } from "fp-ts/lib/function";
import { TList, fromTList, ListId } from "@framework/List";
import customFetch, { mapTDecoded } from "@framework/fetch";
import { TItemStory } from ".";

export const ENDPOINTS = {
  story: (id: ListId) =>
    new URL(`https://hacker-news.firebaseio.com/v0/item/${id.toString()}.json`),
};

export const getStory = (id: ListId) =>
  pipe(id, ENDPOINTS.story, customFetch(TItemStory));
