import { useStories } from "..";
import * as RD from "@devexperts/remote-data-ts";
import * as O from "fp-ts/Option";
import {
  server,
  mockSuccessItemRequest,
  mockSuccessListRequest,
} from "@kuroski-hackernews/mocks";
import { pipe } from "fp-ts/function";
import { nextTick } from "vue-demi";

const scheduler =
  typeof setImmediate === "function" ? setImmediate : setTimeout;

function flushPromises() {
  return new Promise(function (resolve) {
    scheduler(resolve, 1000);
  });
}

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

    // await flushPromises();
    // await flushPromises();
    // await nextTick();

    // expect(stories.value).toHaveLength(1);
    // expect(stories.value).toMatchInlineSnapshot(`
    //   Array [
    //     Object {
    //       "_tag": "ItemStory",
    //       "by": "dhouston",
    //       "id": 76686866,
    //       "kids": Array [],
    //       "text": Object {
    //         "_tag": "None",
    //       },
    //       "title": Object {
    //         "_tag": "Some",
    //         "value": "My story 76686866",
    //       },
    //       "url": Object {
    //         "_tag": "Some",
    //         "value": "http://my-url.com/?storyId=76686866",
    //       },
    //     },
    //   ]
    // `);
    // expect(remoteData.value).toEqual(RD.success(stories.value));
    // expect(O.isSome(loadMore.value)).toBeTruthy();

    // const loadMore = pipe(
    //   result.current.loadMore,
    //   O.getOrElseW(() => {
    //     throw new Error("Load more must exist in this test");
    //   })
    // );

    // act(() => {
    //   loadMore();
    // });

    // expect(result.current.remoteData).toBe(RD.pending);

    // await waitForNextUpdate();

    // expect(result.current.stories).toHaveLength(2);
    // expect(result.current.stories).toMatchInlineSnapshot(`
    //   Array [
    //     Object {
    //       "_tag": "ItemStory",
    //       "by": "dhouston",
    //       "id": 76686866,
    //       "kids": Array [],
    //       "text": Object {
    //         "_tag": "None",
    //       },
    //       "title": Object {
    //         "_tag": "Some",
    //         "value": "My story 76686866",
    //       },
    //       "url": Object {
    //         "_tag": "Some",
    //         "value": "http://my-url.com/?storyId=76686866",
    //       },
    //     },
    //     Object {
    //       "_tag": "ItemStory",
    //       "by": "dhouston",
    //       "id": 67829238,
    //       "kids": Array [],
    //       "text": Object {
    //         "_tag": "None",
    //       },
    //       "title": Object {
    //         "_tag": "Some",
    //         "value": "My story 67829238",
    //       },
    //       "url": Object {
    //         "_tag": "Some",
    //         "value": "http://my-url.com/?storyId=67829238",
    //       },
    //     },
    //   ]
    // `);
    // expect(result.current.remoteData).toEqual(
    //   RD.success(result.current.stories)
    // );
    // expect(O.isNone(result.current.loadMore)).toBeTruthy();
  });
});
