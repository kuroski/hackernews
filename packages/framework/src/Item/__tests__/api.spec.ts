import { getStory, TItemStory } from "..";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { FetchError, toDecodingError } from "@framework/fetch";
import { fromTListItem, TListItem } from "@framework/List";
import { pipe } from "fp-ts/function";
import { server, mockSuccessItemRequest } from "@kuroski-hackernews/mocks";
import { error } from "fp-ts/Console";

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
  "by": "dhouston",
  "id": 8863,
  "kids": Array [
    8952,
    9224,
    8917,
  ],
  "text": Object {
    "_tag": "None",
  },
  "title": Object {
    "_tag": "Some",
    "value": "My YC app: Dropbox - Throw away your USB drive",
  },
  "url": Object {
    "_tag": "Some",
    "value": "http://www.getdropbox.com/u/2/screencast.html",
  },
}
`);
  });
});
