import type { NextPage } from "next";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as RD from "@devexperts/remote-data-ts";
import { fetchErrorToString } from "@framework/fetch";
import { useStories } from "@framework/react/hooks";
import * as I from "@framework/Item";

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-sonic-silver"
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
  item: I.Item;
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
        {url.toString()}
      </a>
    )),
    O.getOrElse(() => <></>)
  );

  return pipe(
    props.item,
    I.fold(
      () => (
        <div className="flex flex-col p-2 m-2 text-3xl">
          <span>{title}</span>
          <small className="text-sm text-silver-metallic">{url}</small>
          <small>story</small>
        </div>
      ),
      () => (
        <div className="flex flex-col p-2 m-2 text-3xl">
          <span>{title}</span>
          <small className="text-sm text-silver-metallic">{url}</small>
          <small>job</small>
        </div>
      )
    )
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
    <div className="w-full flex flex-col items-center gap-4">
      <div className="bg-lavender-blush border-sonic-silver border-4 rounded shadow divide-y divide-gray-200 divide-solid">
        {stories.map((item) => (
          <Story key={item.id.toString()} item={item} />
        ))}
      </div>

      {loadMoreButton}
    </div>
  );
};

export default Home;
