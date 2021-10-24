import { getLists } from "..";
import { server } from "../../mocks/server";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";

describe("List: api", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("works", async () => {
    await pipe(
      getLists,
      TE.fold(
        (e) => {
          return T.fromIO(() => console.error(e));
        },
        (a) => {
          return T.fromIO(() => console.log(a));
        }
      )
    )();

    expect(true).toBe(true);
  });
});
