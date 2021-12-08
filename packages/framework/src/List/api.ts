import { pipe } from "fp-ts/lib/function";
import { TList, fromTList } from "./List";
import customFetch, { mapTDecoded } from "../fetch";

export const ENDPOINTS: Record<string, URL> = {
  topStories: new URL("https://hacker-news.firebaseio.com/v0/topstories.json"),
};

export const getLists = pipe(
  ENDPOINTS.topStories,
  customFetch(TList),
  mapTDecoded(fromTList)
);
