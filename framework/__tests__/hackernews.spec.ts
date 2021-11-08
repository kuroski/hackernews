import { topStories } from "@framework/hackernews";
import { error, log } from "fp-ts/lib/Console";
import { absurd, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as ROR from "fp-ts/lib/ReadonlyRecord";

describe("hackernews API", () => {
  it("lists the best stories", async () => {
    const [items, next] = await pipe(
      topStories(),
      TE.foldW(
        (e) => {
          error(e)();
          return T.never;
        },
        (a) => {
          return T.of(a);
        }
      )
    )();

    const result = await items();

    console.log(result);

    const b = next();
    console.log("=====", await b[0]());

    expect(true).toBe(true);
  });
});
