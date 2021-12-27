# Hackernews PoC

This is a study project, my main goal is:

> To build a strict and decoupled FE application while validating FP concepts I'm studying.

## Structure

- `examples/*`: examples folder containing `packages/framework` implementations
- `packages/*`: business logic here
  - `packages/framework`: main package, where everything happens 😉
  - `packages/react`: react hook port of `packages/framework`
  - `packages/vue`: vue hook port of `packages/framework`
  - `packages/mocks`: mock server config, to help packages testing

## Install

```sh
pnpm install
```

## Build

This command will build all packages and example applications:

```sh
pnpm build
```

## Test

This command will trigger tests for every package and example application:

```sh
pnpm test
```

## What?

After a friend showed me some ideas he was trying to implement in his company, I got inspired and decided to build this project as a challenge on doing my implementation on the concepts I saw.

This is mostly a challenge to force me to study a bit more topics like:

- FP in TS/JS ecossystem
- Monorepos (I could be simpler... If I knew the tools before 😂)

> I have to build a naive version of Hackernews.

To keep this project simple, I want just to list and paginate `top stories`.

### Rules

- The project must be a monorepo
- The main application logic must be framework/lib agnostic
- Packages must be tested
- Try to keep impossible states impossible

## Motivation

I'm working with FE for a while right now and from past experiences, we end up attaching a lot of the business to the framework we are currently using.

It's not hard to find `insert_your_fe_framework_or_lib` applications where I had to face a complex tangling of business rules combined with UI stuff.

This is perfectly fine since we are not building an application using a stack to end up refactoring 1-2 years after in new tech, right?

So there is no problem with relying on specific aspects of the tools you are using but...I want to try creating an isolated layer containing all application logic, and then plugging that on demand.

## TODO:

- [x] Create a basic framework structure
- [x] Create the first example using next
- [x] Create the monorepo structure
- [x] Create different framework usage examples (with Vue)
- [x] Create basic terminal usage example
- [ ] Document repo
- [ ] Write article
- [ ] Create cache system
