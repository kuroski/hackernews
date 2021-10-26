import { ENDPOINTS, getStory, TItemStory } from "..";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { server, rest } from "@framework/mocks/server";
import { FetchError } from "@framework/fetch";
import { ListId } from "@framework/List";

describe("Item: api", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("Resolves reddit lists request", async () => {
    const ID = ListId.decode(8863);
    if (E.isLeft(ID)) return;

    console.log(ENDPOINTS.story(ID.right).toString());

    server.use(
      rest.get(ENDPOINTS.story(ID.right).toString(), (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            by: "dhouston",
            descendants: 71,
            id: 8863,
            kids: [
              9224, 8917, 8952, 8958, 8884, 8887, 8869, 8940, 8908, 9005, 8873,
              9671, 9067, 9055, 8865, 8881, 8872, 8955, 10403, 8903, 8928, 9125,
              8998, 8901, 8902, 8907, 8894, 8870, 8878, 8980, 8934, 8943, 8876,
            ],
            score: 104,
            time: 1175714200,
            title: "My YC app: Dropbox - Throw away your USB drive",
            text: "HEEELLO WORLD!",
            type: "story",
            url: "http://www.getdropbox.com/u/2/screencast.html",
          })
        );
      })
    );

    const result = await getStory(ID.right)();
    const item = E.getOrElseW((e: FetchError): never => {
      throw new Error(e.error.message);
    })(result);

    console.log(item);

    expect(E.isRight(result)).toBeTruthy();
  });
});
