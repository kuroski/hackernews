import { ENDPOINTS, getStory, TItemStory } from "..";
import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { server, rest } from "@framework/mocks/server";
import { FetchError } from "@framework/fetch";
import { fromTListItem, ListId, TListItem } from "@framework/List";
import { pipe } from "fp-ts/lib/function";

describe("Item: api", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("Resolves reddit lists request", async () => {
    const ListId = pipe(TListItem.decode(8863), E.chain(fromTListItem));
    if (E.isLeft(ListId)) return;

    const result = await getStory(ListId.right)();
    const item = E.getOrElseW((e: FetchError): never => {
      throw new Error(e.error.message);
    })(result);

    console.log(item);

    expect(E.isRight(result)).toBeTruthy();
  });
});
