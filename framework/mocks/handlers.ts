import { rest } from "msw";
import faker from "faker";
import { ENDPOINTS as LIST_ENDPOINTS } from "@framework/List";
import { ENDPOINTS as ITEM_ENDPOINTS } from "@framework/Item";

export const handlers = [
  rest.get(LIST_ENDPOINTS.topStories.toString(), (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([...Array(500)].map(() => Number(faker.finance.account(8))))
    );
  }),
];
