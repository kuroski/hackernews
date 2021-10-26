import { ENDPOINTS, getLists } from "..";
import * as E from "fp-ts/lib/Either";
import { server, rest } from "@framework/mocks/server";
import { FetchError } from "@framework/fetch";

describe("List: api", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("Resolves reddit lists request", async () => {
    const result = await getLists();
    const lists = E.getOrElseW((e: FetchError): never => {
      throw new Error(e.error.message);
    })(result);

    expect(E.isRight(result)).toBeTruthy();
    expect(lists).toHaveLength(500);
  });

  describe("Throws error when", () => {
    it("invalid data provided", async () => {
      server.use(
        rest.get(ENDPOINTS.topStories.toString(), async (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json(["abc"]));
        })
      );

      const result = await getLists();
      const error = E.match(
        (e: FetchError) => e,
        (): never => {
          throw new Error("This should have thrown an error");
        }
      )(result);

      expect(E.isLeft(result)).toBeTruthy();
      expect(error).toMatchInlineSnapshot(`
Object {
  "_tag": "DECODING_ERROR",
  "error": [Error: Invalid value "abc" supplied to : Array<number>/0: number],
}
`);
    });

    it("bad request", async () => {
      server.use(
        rest.get(ENDPOINTS.topStories.toString(), async (_req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: "The server went on vacation" })
          );
        })
      );

      const result = await getLists();
      const error = E.match(
        (e: FetchError) => e,
        (): never => {
          throw new Error("This should have thrown an error");
        }
      )(result);

      expect(E.isLeft(result)).toBeTruthy();
      expect(error._tag).toMatchInlineSnapshot(`"RESPONSE_ERROR"`);
      expect(error.error.message).toMatchInlineSnapshot(
        `"{\\"error\\":\\"The server went on vacation\\"}"`
      );
    });

    it("offline", async () => {
      server.use(
        rest.get(ENDPOINTS.topStories.toString(), async (_req, res) => {
          return res.networkError("User is offline");
        })
      );

      const result = await getLists();
      const error = E.match(
        (e: FetchError) => e,
        (): never => {
          throw new Error("This should have thrown an error");
        }
      )(result);

      expect(E.isLeft(result)).toBeTruthy();
      expect(error._tag).toMatchInlineSnapshot(`"NETWORK_ERROR"`);
      expect(error.error.message).toMatchInlineSnapshot(
        `"request to https://hacker-news.firebaseio.com/v0/topstories.json failed, reason: User is offline"`
      );
    });
  });
});
