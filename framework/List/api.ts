import { flow, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { TList, fromTList } from "./List";
import customFetch, { toDecodingError } from "../fetch";

export const ENDPOINTS: Record<string, URL> = {
  topStories: new URL("https://hacker-news.firebaseio.com/v0/topstories.json"),
};

export const getLists = pipe(
  ENDPOINTS.topStories,
  customFetch(TList),
  TE.chain(flow(fromTList, E.mapLeft(toDecodingError), TE.fromEither))
);
