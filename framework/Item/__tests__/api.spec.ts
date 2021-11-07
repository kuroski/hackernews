import { getStory, TItemStory } from "..";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { FetchError, toDecodingError } from "@framework/fetch";
import { fromTListItem, TListItem } from "@framework/List";
import { absurd, pipe } from "fp-ts/lib/function";
import { server } from "@framework/mocks/server";
import { rest } from "msw";
import { error } from "fp-ts/lib/Console";

describe("Item: api", () => {
  it("Resolves reddit lists request", async () => {
    server.use(
      rest.get(
        "https://hacker-news.firebaseio.com/v0/item/:storyId.json",
        async (_req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: 8863,
              title: "My YC app: Dropbox - Throw away your USB drive",
              url: "http://www.getdropbox.com/u/2/screencast.html",
            })
          );
        }
      )
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
