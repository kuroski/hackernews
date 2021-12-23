import { until } from "@vueuse/core";
import { useStories } from "..";
import * as RD from "@devexperts/remote-data-ts";
import * as O from "fp-ts/Option";
import {
  server,
  mockSuccessItemRequest,
  mockSuccessListRequest,
} from "@kuroski-hackernews/mocks";
import { pipe } from "fp-ts/function";

describe("Hooks", () => {
  test("useStories", async () => {
    server.use(
      mockSuccessListRequest((_req) => [76686866, 67829238]),
      mockSuccessItemRequest((req) => ({
        id: Number(req.params.storyId),
        title: `My story ${req.params.storyId}`,
        url: `http://my-url.com?storyId=${req.params.storyId}`,
        kids: [],
      }))
    );

    const { remoteData, stories, loadMore } = useStories(1);

    expect(stories.value).toHaveLength(0);
    expect(remoteData.value).toEqual(RD.pending);
    expect(loadMore.value).toEqual(O.none);

    await until(remoteData).changed();

    expect(stories.value).toHaveLength(1);
    expect(stories.value).toMatchInlineSnapshot(`
      Array [
        Object {
          "_tag": "ItemStory",
          "by": "dhouston",
          "id": 76686866,
          "kids": Array [],
          "text": Object {
            "_tag": "None",
          },
          "title": Object {
            "_tag": "Some",
            "value": "My story 76686866",
          },
          "url": Object {
            "_tag": "Some",
            "value": "http://my-url.com/?storyId=76686866",
          },
        },
      ]
    `);
    expect(remoteData.value).toEqual(RD.success(stories.value));
    expect(O.isSome(loadMore.value)).toBeTruthy();

    pipe(
      loadMore.value,
      O.getOrElseW(() => {
        throw new Error("Load more must exist in this test");
      })
    )();

    expect(RD.isPending(remoteData.value)).toBeTruthy();

    await until(remoteData).changed();

    expect(stories.value).toHaveLength(2);
    expect(stories.value).toMatchInlineSnapshot(`
      Array [
        Object {
          "_tag": "ItemStory",
          "by": "dhouston",
          "id": 76686866,
          "kids": Array [],
          "text": Object {
            "_tag": "None",
          },
          "title": Object {
            "_tag": "Some",
            "value": "My story 76686866",
          },
          "url": Object {
            "_tag": "Some",
            "value": "http://my-url.com/?storyId=76686866",
          },
        },
        Object {
          "_tag": "ItemStory",
          "by": "dhouston",
          "id": 67829238,
          "kids": Array [],
          "text": Object {
            "_tag": "None",
          },
          "title": Object {
            "_tag": "Some",
            "value": "My story 67829238",
          },
          "url": Object {
            "_tag": "Some",
            "value": "http://my-url.com/?storyId=67829238",
          },
        },
      ]
    `);
    expect(remoteData.value).toEqual(RD.success(stories.value));
    expect(O.isNone(loadMore.value)).toBeTruthy();
  });
});
