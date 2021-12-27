# React

Port of `framework` package to a react hook.

# Usage

```sh
pnpm install @kuroski-hackernews/react
```

### Example 1

```typescript
import { useStories, fetchErrorToString } from "@kuroski-hackernews/react";
import * as RD from "@devexperts/remote-data-ts";

const App = () => {
  const PER_PAGE = 10;
  const { remoteData, loadMore } = useStories(PER_PAGE);

  return pipe(
    remoteData,
    RD.fold(
      () => <div>Nothing loaded yet</div>,
      () => <div>Loading...</div>,
      (err) => <div>{fetchErrorToString(err)}</div>,
      (stories) => (
        <div>
          {stories.map((item, index) => (
            <div key={item.id.toString()}>
              <Story id={item.id.toString()} item={item} />
            </div>
          ))}

          {pipe(
            loadMore,
            O.match(
              () => <div>All loaded up =D</div>,
              (next) => <button onClick={next}>Load More</button>
            )
          )}
        </div>
      )
    )
  );
};
```

### Example 2

```typescript
import { useStories, fetchErrorToString } from "@kuroski-hackernews/react";
import * as RD from "@devexperts/remote-data-ts";

const App = () => {
  const PER_PAGE = 10;
  const { remoteData, stories, loadMore } = useStories(PER_PAGE);

  const loadMoreButton = pipe(
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
            (next) => <button onClick={next}>Load More</button>
          )
        )
    )
  );

  return (
    <div>
      <h1>Top stories</h1>

      {stories.map((item, index) => (
        <div key={item.id.toString()}>
          <Story id={item.id.toString()} item={item} />
        </div>
      ))}

      {loadMoreButton}
    </div>
  );
};
```

# Dev

## Install

```sh
pnpm install
```

## Develop

To trigger watch mode, just:

```sh
pnpm watch
```

## Build

```sh
pnpm build
```

## Test

```sh
pnpm test
```
