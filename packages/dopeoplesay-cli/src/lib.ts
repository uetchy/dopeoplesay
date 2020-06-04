import chalk from 'chalk';

export function consoleJSON(obj: unknown): void {
  console.log(JSON.stringify(obj, null, 2));
}

export function info(text: string): void {
  console.log(chalk.yellow(text));
}

export function head(text: string): void {
  console.log(chalk.bold.blue(`[${text.toUpperCase()}]`));
}

export function hr(): void {
  console.log();
}
