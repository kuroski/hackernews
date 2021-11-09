import { topStories } from "@framework/hackernews";
import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/Task";

describe("hackernews API", () => {
  it("lists the best stories", async () => {
    await pipe(
      topStories(1),
      T.map(([items, next]) => {
        expect(items).toHaveLength(1);
        expect(items).toMatchInlineSnapshot(`
Array [
  Object {
    "_tag": "ItemStory",
    "id": 37849821,
    "title": Object {
      "_tag": "Some",
      "value": "Aliquid neque vitae ipsam qui porro vero. Aut eius et sed nulla nihil dolorum dolore voluptas culpa. Fuga minima maxime et et eos id officiis voluptatum at. Minima eligendi consequatur provident nesciunt aut numquam id ipsam enim. Est quae dolore sequi et veritatis iste excepturi.",
    },
    "url": "http://www.getdropbox.com/u/2/screencast.html",
  },
]
`);
        return next();
      }),
      T.map(([items, _next]) => {
        expect(items).toHaveLength(2);
        expect(items).toMatchInlineSnapshot();
        return T.never;
      })
    )();

    // const [items, next] = await topStories(1)();

    // console.log(items);

    // const b = next();
    // console.log("=====", await b[0]());

    // expect(true).toBe(true);
  });
});
