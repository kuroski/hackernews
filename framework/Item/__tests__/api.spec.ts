import { getStory, TItemStory } from "..";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { FetchError, toDecodingError } from "@framework/fetch";
import { fromTListItem, TListItem } from "@framework/List";
import { pipe } from "fp-ts/lib/function";
import { server } from "@framework/mocks/server";
import { error } from "fp-ts/lib/Console";
import { mockSuccessItemRequest } from "@framework/mocks/handlers";

describe("Item: api", () => {
  it("Resolves reddit lists request", async () => {
    server.use(
      mockSuccessItemRequest((_req) => ({
        id: 8863,
        title: "My YC app: Dropbox - Throw away your USB drive",
        url: "http://www.getdropbox.com/u/2/screencast.html",
      }))
    );

    const result = await pipe(
      TListItem.decode(8863),
      E.chain(fromTListItem),
      E.mapLeft(toDecodingError),
      TE.fromEither,
      TE.chain(getStory),
      TE.getOrElseW<FetchError, TItemStory>((e) => {
        error(e)();
        return T.never;
      })
    )();

    expect(result).toMatchInlineSnapshot(`
Object {
  "_tag": "ItemStory",
  "id": 8863,
  "title": Object {
    "_tag": "Some",
    "value": "My YC app: Dropbox - Throw away your USB drive",
  },
  "url": "http://www.getdropbox.com/u/2/screencast.html",
}
`);
  });
});
