import { Fetcher } from "fetcher-ts";
import { identity, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as O from "fp-ts/lib/Option";
import { fromTList, TList } from "./List";

const ENDPOINTS: Record<string, URL> = {
  topStories: new URL("https://hacker-news.firebaseio.com/v0/topstories.json"),
};

type GetListResult = { code: 200; payload: TList };

const fetcher = new Fetcher<GetListResult, TList>(
  ENDPOINTS.topStories.toString()
)
  .handle(200, identity, TList)
  .map(fromTList)
  .toTaskEither();

export const getLists = () =>
  pipe(
    fetcher,
    TE.chainW(([result, error]) => {
      if (O.isSome(error)) {
        console.log("=====");
        console.log(error);
      }
      return TE.fromEither(result);
    }),
    TE.fold(
      (e) => {
        return T.fromIO(() => console.error(e));
      },
      (a) => {
        return T.fromIO(() => console.log(a));
      }
    )
  );
