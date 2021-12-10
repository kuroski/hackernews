import { topStories } from "@framework/hackernews";
import { pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import {
  server,
  mockBadItemRequest,
  mockSuccessItemRequest,
  mockSuccessListRequest,
} from "@kuroski-hackernews/mocks";
import { fetchErrorToString } from "@framework/fetch";

describe("hackernews API", () => {
  // eslint-disable-next-line jest/no-done-callback
  it("lists the best stories", (done) => {
    server.use(
      mockSuccessListRequest((_req) => [76686866, 67829238]),
      mockSuccessItemRequest((req) => ({
        id: Number(req.params.storyId),
        title: `My story ${req.params.storyId}`,
        url: `http://my-url.com?storyId=${req.params.storyId}`,
      }))
    );

    pipe(
      topStories(1),
      TE.chain(([items, nextOption]) => {
        expect(items).toHaveLength(1);
        expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "_tag": "ItemStory",
    "by": "dhouston",
    "id": 76686866,
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
      "value": "My story 76686866",
    },
    "url": Object {
      "_tag": "Some",
      "value": "http://my-url.com/?storyId=76686866",
    },
  },
]
`);
        const next = pipe(
          nextOption,
          O.getOrElseW(() => {
            throw new Error("Next function must be present within this test");
          })
        );

        return next();
      }),
      TE.map(([items, _next]) => {
        expect(items).toHaveLength(2);
        expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "_tag": "ItemStory",
    "by": "dhouston",
    "id": 76686866,
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
      "value": "My story 67829238",
    },
    "url": Object {
      "_tag": "Some",
      "value": "http://my-url.com/?storyId=67829238",
    },
  },
]
`);
        return done();
      })
    )();
  });

  // eslint-disable-next-line jest/no-done-callback
  it("handles stories fetch errors", (done) => {
    server.use(
      mockSuccessListRequest((_req) => [76686866, 67829238]),
      mockBadItemRequest
    );

    pipe(
      topStories(1),
      TE.fold(
        (error) => T.of(fetchErrorToString(error)),
        () => T.never
      ),
      T.map((errorMessage) => {
        expect(errorMessage).toMatchInlineSnapshot(
          `"{\\"error\\":\\"The server went on vacation\\"}"`
        );
        return done();
      })
    )();
  });
});
