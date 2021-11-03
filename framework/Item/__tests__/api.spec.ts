import { getStory, TItemStory } from "..";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { FetchError, toDecodingError } from "@framework/fetch";
import { fromTListItem, TListItem } from "@framework/List";
import { pipe } from "fp-ts/lib/function";

describe("Item: api", () => {
  it("Resolves reddit lists request", async () => {
    const result = await pipe(
      TListItem.decode(8863),
      E.chain(fromTListItem),
      E.mapLeft(toDecodingError),
      TE.fromEither,
      TE.chain(getStory),
      TE.getOrElseW<FetchError, TItemStory>((e): never => {
        throw new Error(e.error.message);
      })
    )();

    expect(result).toMatchInlineSnapshot(`
Object {
  "id": 8863,
  "title": "My YC app: Dropbox - Throw away your USB drive",
  "url": "http://www.getdropbox.com/u/2/screencast.html",
}
`);
  });
});