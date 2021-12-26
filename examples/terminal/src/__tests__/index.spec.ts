/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { topStories } from "../";
import * as O from "fp-ts/Option";
import {
  server,
  mockSuccessItemRequest,
  mockSuccessListRequest,
} from "@kuroski-hackernews/mocks";

describe("Terminal", () => {
  it("fetches hackernews top stories", async () => {
    server.use(
      mockSuccessListRequest((_req) => [76686866, 67829238]),
      mockSuccessItemRequest((req) => ({
        id: Number(req.params.storyId),
        title: `My story ${req.params.storyId}`,
        url: `http://my-url.com?storyId=${req.params.storyId}`,
        kids: [],
      }))
    );

    const items = await topStories(10)();

    expect(items).toMatchInlineSnapshot(`
      Array [
        Object {
          "title": "My story 76686866",
          "url": "http://my-url.com/?storyId=76686866",
        },
        Object {
          "title": "My story 67829238",
          "url": "http://my-url.com/?storyId=67829238",
        },
      ]
    `);
  });
});
