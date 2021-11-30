import type { NextPage } from "next";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as RD from "@devexperts/remote-data-ts";
import { fetchErrorToString } from "@framework/fetch";
import { useStories } from "@framework/react/hooks";
import { Item } from "@framework/Item";

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

type StoryProps = {
  item: Item;
};

const Story = (props: StoryProps) => {
  const title = pipe(
    props.item.title,
    O.getOrElse(() => "-")
  );

  const url = pipe(
    props.item.url,
    O.map((url) => (
      <a key={url.toString()} href={url.toString()}>
        ({url.toString()})
      </a>
    )),
    O.getOrElse(() => <div>(-)</div>)
  );
  return (
    <div className="flex flex-col p-2 m-2">
      <span>{title}</span>
      <small className="text-xs font-thin">{url}</small>
    </div>
  );
};

const Home: NextPage = () => {
  const { remoteData, stories, loadMore } = useStories(3);

  const loadMoreButton = pipe(
    remoteData,
    RD.fold(
      () => <div>Nothing loaded yet</div>,
      () => <Spinner />,
      (err) => <div>{fetchErrorToString(err)}</div>,
      (_result) =>
        pipe(
          loadMore,
          O.match(
            () => <div>All loaded up =D</div>,
            (next) => (
              <button key="load-more" onClick={next} className="button">
                Load More
              </button>
            )
          )
        )
    )
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-gray-200 rounded shadow divide-y divide-purple-300 divide-dashed">
        {stories.map((item) => (
          <Story key={item.id.toString()} item={item} />
        ))}
      </div>

      {loadMoreButton}
    </div>
  );
};

export default Home;
