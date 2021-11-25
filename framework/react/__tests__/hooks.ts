import { renderHook } from "@testing-library/react-hooks";
import { useStories } from "@framework/react/hooks";

describe("Hooks", () => {
  test("useStories", async () => {
    const { waitForNextUpdate, result } = renderHook(() => useStories(2));

    console.log(result.current.stories);

    await waitForNextUpdate();

    console.log(result.current.stories);
  });
});
