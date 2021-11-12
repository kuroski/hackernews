import {
  DefaultRequestBody,
  RequestParams,
  ResponseResolver,
  rest,
  RestContext,
  RestRequest,
} from "msw";
import faker from "faker";
import { ENDPOINTS as LIST_ENDPOINTS, TList } from "@framework/List";
import { TItemStory } from "@framework/Item";

// #region List mocks

const listHandler = (
  cb: ResponseResolver<
    RestRequest<DefaultRequestBody, RequestParams>,
    RestContext,
    any
  >
) => rest.get(LIST_ENDPOINTS.topStories.toString(), cb);

export const mockSuccessListRequest = (
  overrides?: (req: RestRequest<DefaultRequestBody, RequestParams>) => TList
) =>
  listHandler((req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        overrides?.(req) ||
          [...Array(500)].map(() => Number(faker.finance.account(8)))
      )
    )
  );

export const mockInvalidListRequest = listHandler((_req, res, ctx) =>
  res(ctx.status(200), ctx.json(["abc"]))
);

export const mockBadListRequest = listHandler((_req, res, ctx) =>
  res(ctx.status(500), ctx.json({ error: "The server went on vacation" }))
);

//#endregion

// #region Item mocks
const itemHandler = (
  cb: ResponseResolver<
    RestRequest<DefaultRequestBody, RequestParams>,
    RestContext,
    any
  >
) => rest.get("https://hacker-news.firebaseio.com/v0/item/:storyId.json", cb);

export const mockSuccessItemRequest = (
  overrides?: (
    req: RestRequest<DefaultRequestBody, RequestParams>
  ) => TItemStory
) =>
  itemHandler((req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        by: "dhouston",
        descendants: 71,
        id: Number(req.params.storyId),
        kids: [8952, 9224, 8917],
        score: 111,
        time: 1175714200,
        title: faker.lorem.paragraph(),
        type: "story",
        url: "http://www.getdropbox.com/u/2/screencast.html",
        ...overrides?.(req),
      })
    )
  );

export const mockInvalidItemRequest = itemHandler((_req, res, ctx) =>
  res(ctx.status(200), ctx.json(["abc"]))
);

export const mockBadItemRequest = itemHandler((_req, res, ctx) =>
  res(ctx.status(500), ctx.json({ error: "The server went on vacation" }))
);

//#endregion

export const handlers = [mockSuccessListRequest(), mockSuccessItemRequest()];
