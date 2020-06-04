#!/usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import yargs from 'yargs';
import {consoleJSON, head, hr, info} from './lib';
import {search, makeURL} from 'dopeoplesay';

const spinner = ora();

interface Args {
  [key: string]: unknown;
  $0: string;
  json: boolean;
  trim: boolean;
  _: string[];
}

async function main(args: Args): Promise<void> {
  const query = args._.join(' ');
  const jsonOutputMode = args.json;
  const trimLineMode = args.trim;

  if (!query) {
    throw new Error('No query provided. Try $ dps [--json] <query>');
  }

  if (!jsonOutputMode) {
    spinner.text = `Querying for '${query}'`;
    spinner.start();
  }

  const {definitions, collocations} = await search(query, {
    color: !jsonOutputMode,
    trim: trimLineMode,
  }).catch((err) => {
    switch (err.code) {
      case 'ENOTFOUND':
        throw new Error(
          'Your request has been failed maybe due to network lost. Try it again.',
        );
      default:
        throw new Error(err.message);
    }
  });

  if (jsonOutputMode) {
    return consoleJSON({definitions, collocations});
  }

  spinner.succeed();
  hr();

  // Showing result
  if (definitions.length > 0) {
    head('Dictionary');
    for (const term of definitions) {
      // eslint-disable-next-line no-console
      console.log(
        chalk.red(
          `${chalk.underline(term.label!)}${
            term.pos ? ' (' + term.pos + ')' : ''
          } from ${term.source}`,
        ),
      );
      for (const def of term.definitions) {
        // eslint-disable-next-line no-console
        console.log(chalk.italic(' →', def!.replace(/\n/g, '\n  ')));
      }
    }
    hr();
  }

  head('Collocations');
  collocations.forEach((item, index): void => {
    // eslint-disable-next-line no-console
    console.log(`${chalk.gray(String(index + 1).padStart(2))} ${item}`);
  });

  info(`\nSee more at ${makeURL(query)}`);
}

function errorHandler(error: string, jsonOutput: boolean): void {
  if (jsonOutput) {
    consoleJSON({error});
  } else {
    spinner.fail(error);
  }
}

const argv: Args = yargs
  .option('$0', {required: true, demandOption: true})
  .option('json', {alias: 'j', boolean: true, default: false})
  .option('trim', {alias: 't', boolean: true, default: true})
  .demandOption(['$0'])
  .help()
  .fail((msg, err): void => errorHandler(msg || err.message, argv.json)).argv;

main(argv).catch((err): void => errorHandler(err.message, argv.json));
