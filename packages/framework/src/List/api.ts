import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { ListIdBrand, TList, fromTList } from "./List";
import customFetch, { mapTDecoded, FetchError } from "../fetch";
import { Branded, IntBrand } from "io-ts";

export const ENDPOINTS: Record<string, URL> = {
  topStories: new URL("https://hacker-news.firebaseio.com/v0/topstories.json"),
};

export const getLists: TE.TaskEither<
  FetchError,
  readonly Branded<Branded<number, IntBrand>, ListIdBrand>[]
> = pipe(ENDPOINTS.topStories, customFetch(TList), mapTDecoded(fromTList));
