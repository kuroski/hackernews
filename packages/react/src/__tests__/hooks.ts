import { act, renderHook } from "@testing-library/react-hooks";
import { useStories } from "../hooks";
import * as RD from "@devexperts/remote-data-ts";
import * as O from "fp-ts/lib/Option";
import { server } from "@framework/mocks/server";
import {
  mockSuccessItemRequest,
  mockSuccessListRequest,
} from "@framework/mocks/handlers";
import { pipe } from "fp-ts/lib/function";

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

    const { waitForNextUpdate, result } = renderHook(() => useStories(1));

    expect(result.current.stories).toHaveLength(0);
    expect(result.current.remoteData).toBe(RD.pending);
    expect(result.current.loadMore).toBe(O.none);

    await waitForNextUpdate();

    expect(result.current.stories).toHaveLength(1);
    expect(result.current.stories).toMatchInlineSnapshot(`
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
    expect(result.current.remoteData).toEqual(
      RD.success(result.current.stories)
    );
    expect(O.isSome(result.current.loadMore)).toBeTruthy();

    const loadMore = pipe(
      result.current.loadMore,
      O.getOrElseW(() => {
        throw new Error("Load more must exist in this test");
      })
    );

    act(() => {
      loadMore();
    });

    expect(result.current.remoteData).toBe(RD.pending);

    await waitForNextUpdate();

    expect(result.current.stories).toHaveLength(2);
    expect(result.current.stories).toMatchInlineSnapshot(`
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
    expect(result.current.remoteData).toEqual(
      RD.success(result.current.stories)
    );
    expect(O.isNone(result.current.loadMore)).toBeTruthy();
  });
});
