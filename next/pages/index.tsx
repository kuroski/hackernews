import type { NextPage } from "next";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as RD from "@devexperts/remote-data-ts";
import { fetchErrorToString } from "@framework/fetch";
import { useStories } from "@framework/react/hooks";
import * as I from "@framework/Item";
import React from "react";
import Head from "next/head";
import Link from "next/link";

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
  key: string;
  item: I.Item;
};

const Story = (props: StoryProps) => {
  const title = pipe(
    props.item.title,
    O.getOrElse(() => "-")
  );

  const StoryBase = ({ children }: { children: React.ReactNode }) =>
    pipe(
      props.item.url,
      O.map((url) => (
        <section
          key={props.key}
          className="flex flex-col p-2 m-2 text-xl md:text-3xl leading-none outline-none"
        >
          <Link key={props.key} href={url}>
            {title}
          </Link>
          <small className="text-xs md:text-sm text-sonic-silver">
            {`- ${url.hostname}`}
          </small>
          {children}
        </section>
      )),
      O.getOrElse(() => (
        <section
          key={props.key}
          className="flex flex-col p-2 m-2 text-xl md:text-3xl leading-none"
        >
          <span>{title}</span>
          {children}
        </section>
      ))
    );

  return pipe(
    props.item,
    I.fold(
      () => (
        <StoryBase>
          <small>story</small>
        </StoryBase>
      ),
      () => (
        <StoryBase>
          <small>job</small>
        </StoryBase>
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
      () => (
        <div className="self-center">
          <Spinner />
        </div>
      ),
      (err) => <div>{fetchErrorToString(err)}</div>,
      (_result) =>
        pipe(
          loadMore,
          O.match(
            () => <div>All loaded up =D</div>,
            (next) => (
              <button
                key="load-more"
                onClick={next}
                className="button self-center"
              >
                Load More
              </button>
            )
          )
        )
    )
  );

  return (
    <div>
      <Head>
        <title>Hackernews</title>
      </Head>
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
        <div className="stories flex flex-col px-6 py-4 bg-lavender-blush border-sonic-silver border-4 rounded-paper shadow divide-y divide-gray-200 divide-solid">
          <h1 className="text-xl md:text-3xl text-center mb-2">Top stories</h1>

          {stories.map((item) => (
            <Story key={item.id.toString()} item={item} />
          ))}

          {loadMoreButton}
        </div>
      </div>
    </div>
  );
};

export default Home;
