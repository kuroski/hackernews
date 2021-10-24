import { flow, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as List from "./List";
import customFetch, { toDecodingError } from "../fetch";

const ENDPOINTS: Record<string, URL> = {
  topStories: new URL("https://hacker-news.firebaseio.com/v0/topstories.json"),
};

export const getLists = pipe(
  ENDPOINTS.topStories,
  customFetch(List.TList),
  TE.chain(flow(List.fromTList, E.mapLeft(toDecodingError), TE.fromEither))
);
