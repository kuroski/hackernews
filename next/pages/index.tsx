import type { NextPage } from "next";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as RD from "@devexperts/remote-data-ts";
import { fetchErrorToString } from "@framework/fetch";
import { useStories } from "@framework/react/hooks";

const Home: NextPage = () => {
  const { remoteData, stories, loadMore } = useStories(3);

  return (
    <>
      <ul className="space-y-6 bg-gray-200 rounded shadow">
        {stories.map((i) => (
          <li key={i.id.toString()} className="p-4">
            <span>{JSON.stringify(i.title)}</span>
            <small>{JSON.stringify(i.url)}</small>
          </li>
        ))}
      </ul>

      {pipe(
        remoteData,
        RD.fold(
          () => <div>Nothing loaded yet</div>,
          () => <div>Loading...</div>,
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
      )}
    </>
  );
};

export default Home;
