import { topStories } from "@framework/hackernews";
import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { server } from "@framework/mocks/server";
import { rest } from "msw";
import { ENDPOINTS } from "@framework/List";
import { fetchErrorToString } from "@framework/fetch";
import {
  mockBadItemRequest,
  mockSuccessItemRequest,
  mockSuccessListRequest,
} from "@framework/mocks/handlers";

describe("hackernews API", () => {
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
      TE.chain(([items, next]) => {
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
