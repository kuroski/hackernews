import { rest } from "msw";
import faker from "faker";
import { ENDPOINTS as LIST_ENDPOINTS } from "@framework/List";
import { ENDPOINTS as ITEM_ENDPOINTS } from "@framework/Item";

export const handlers = [
  rest.get(LIST_ENDPOINTS.topStories.toString(), (_req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json([...Array(500)].map(() => Number(faker.finance.account(8))))
    )
  ),
  rest.get(
    `https://hacker-news.firebaseio.com/v0/item/:storyId.json`,
    (_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          by: "dhouston",
          descendants: 71,
          id: 8863,
          kids: [
            8952, 9224, 8917, 8884, 8887, 8943, 8869, 8958, 9005, 9671, 8940,
            9067, 8908, 9055, 8865, 8881, 8872, 8873, 8955, 10403, 8903, 8928,
            9125, 8998, 8901, 8902, 8907, 8894, 8878, 8870, 8980, 8934, 8876,
          ],
          score: 111,
          time: 1175714200,
          title: "My YC app: Dropbox - Throw away your USB drive",
          type: "story",
          url: "http://www.getdropbox.com/u/2/screencast.html",
        })
      )
  ),
];
