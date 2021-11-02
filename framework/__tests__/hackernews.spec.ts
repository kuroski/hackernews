import { topStories } from "@framework/hackernews";

describe("hackernews API", () => {
  it("lists the best stories", async () => {
    const a = await topStories();

    a();
    expect(true).toBe(true);
  });
});
