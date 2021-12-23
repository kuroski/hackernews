import chalk from "chalk";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { failure } from "io-ts/lib/PathReporter";
import { PerPage, perPage, topStories } from "../hackernews";

const topStoriesCommand = ({
  perPage: storiesPerPage,
}: {
  perPage: PerPage;
}): void => {
  pipe(
    storiesPerPage,
    perPage.decode,
    E.fold(
      (error) => {
        console.log(chalk.red(failure(error)));
        process.exit(1);
      },
      async (itemsPerPage) => {
        console.log(chalk.green("Fetching stories"));

        const result = await topStories(itemsPerPage)();
        result.forEach((story) => {
          console.log(
            chalk.white(
              pipe(
                story.title,
                O.map((title) => `[*] ${title}`),
                O.getOrElse(() => "-")
              )
            )
          );
        });
      }
    )
  );
};

export default topStoriesCommand;
