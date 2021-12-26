import chalk from "chalk";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { failure } from "io-ts/lib/PathReporter";
import { oraPromise } from "ora";
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

        const result = await oraPromise(topStories(itemsPerPage)());
        result.forEach((story, index) => {
          const indexPrint = chalk.magenta.bold(`${index}.`);
          const titlePrint = chalk.blueBright(story.title);
          const urlPrint = chalk.red.underline(`(${story.url})`);
          console.log(indexPrint, "\n  ", titlePrint, "\n  ", urlPrint);
        });
      }
    )
  );
};

export default topStoriesCommand;
