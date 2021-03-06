import { ENDPOINTS, getLists } from "..";
import * as E from "fp-ts/Either";
import {
  server,
  rest,
  mockBadListRequest,
  mockInvalidListRequest,
} from "@kuroski-hackernews/mocks";
import { FetchError } from "@framework/fetch";

describe("List: api", () => {
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
      server.use(mockInvalidListRequest);

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
      server.use(mockBadListRequest);

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
