import { rest } from "msw";
import faker from "faker";
import { ENDPOINTS } from "../List";

export const handlers = [
  rest.get(ENDPOINTS.topStories.toString(), (_req, res, ctx) => {
    return res(
      ctx.status(200),
      // ctx.json(["abc"])
      ctx.json([...Array(500)].map(() => Number(faker.finance.account(8))))
    );
  }),
];
