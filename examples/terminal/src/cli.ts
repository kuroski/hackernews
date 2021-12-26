#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import { Option, program } from "commander";
import topStoriesCommand from "./commands/topStoriesCommand";

clear();
console.log(chalk.magenta("hackernews"));

program.version("1.0.0").description("A CLI to make floor plan recognition");

program
  .command("top")
  .addOption(
    new Option(
      "-p, --per-page <perPage>",
      "how many stories you want per page"
    ).default(20)
  )
  .action(topStoriesCommand);

program.parse();
