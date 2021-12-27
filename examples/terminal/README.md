# Hackernews - Terminal implementation

![mov]("../assets/terminal.mov")

This repo makes use of:

- `@kuroski-hackernews/framework`
- `fp-ts` ecossystem

No hard business rules are implemented.

This project is a CLI application that makes use of the main `@kuroski-hackernews/framework` package.

- `cli.ts`: contains the basic CLI configuration and every command is defined in `commands/*` folder
- `commands/*`: contains the implementation of the commands the CLI can do
  - `commands/topStoriesCommand.ts`: fetches the top stories and displays them in the terminal
- `hackernews.ts`: this file makes the bridge between the CLI and the `@kuroski-hackernews/framework` package, the logic is here instead of the `topStoriesCommand` because I'm using this file to test the general application behavior, since this app is built with node, we also expose the API in cases of usage outside of the scope of a CLI application

## 1. Install

```sh
pnpm install
```

## 2. Dev environment

You can compile the application in watch mode through the command:

```sh
pnpm dev
```

Since this is a CLI application, you have to keep the `dev` environment on, and in a new terminal window, you can run the application by:

```sh
node dist/cli.js --help
node dist/cli.js top
```

## 3. Build the application

```sh
pnpm build
```

You can run the application in the same way as in dev:

```sh
node dist/cli.js --help
node dist/cli.js top
```

## 4. Build the application

```sh
pnpm test
```
