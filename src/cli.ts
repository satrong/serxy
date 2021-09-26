/* eslint-disable no-console */
import * as commander from 'commander';
import * as Fs from 'fs-extra';
import * as Path from 'path';
import getPort from 'get-port';
import chalk from 'chalk';
import server from './server';

type ProxyItem = { pathname: string; target: string };

interface Options {
  port: number;
  directory: string;
  index: string[];
  autoIndex: boolean;
  proxy: ProxyItem[];
  changeOrigin: boolean;
}

function splitFn(value: string) {
  return value.split(',').filter(Boolean);
}

function proxyFn(value: string) {
  const arr = splitFn(value);
  const list: ProxyItem[] = [];
  for (const el of arr) {
    const [pathname, target] = el.split('=>');
    if (!/^\//.test(pathname)) {
      throw new commander.InvalidArgumentError(`[${pathname}] must start with \`/\`.`);
    }
    if (!/^https?:\/\/([a-z\d-]+\.)+[a-z]{2,}/i.test(target)) {
      throw new commander.InvalidArgumentError(`[${target}] must start with http or https.`);
    }

    list.push({ pathname, target });
  }
  return list;
}

function portFn(value: string) {
  const v = Number(value);
  if (Number.isInteger(v)) {
    return v;
  }
  throw new commander.InvalidArgumentError('');
}

const pkg = Fs.readJSONSync(Path.resolve('package.json'));

commander.program
  .version(pkg.version, '-v, --version', 'Output the version number.')
  .helpOption('-h, --help', 'Display help for command')

  .addOption(
    new commander.Option('-p, --port <PORT>', 'Listen on PORT')
      .argParser(portFn)
      .default(8080),
  )

  .option('-d, --directory <DIRECTORY>', 'Serve the contents of DIRECTORY. (Default: `process.cwd()` )')

  .addOption(
    new commander.Option('-i, --index <INDEXES>', 'Use the specified INDEX filename as the result when a directory is requested.')
      .argParser(splitFn)
      .default(['index.html', 'index.htm']),
  )

  .addOption(
    new commander.Option('-ai, --auto-index', 'If the index file is not found will list the directory.')
      .default(true),
  )

  .option(
    '--proxy <PATHNAME=>TARGET>',
    'Set the proxy path.\ne.g. "/api=>http://example.com" will let `/api/foo` proxy to `http://example.com/foo`.\nMultiple use `,` separated.',
    proxyFn,
  )

  .addOption(
    new commander.Option('-co, --change-origin', 'Changes the origin of the host header to the proxy\'s URLs.')
      .default(true),
  )

  .parse(process.argv);

async function bootstrap(options: Options) {
  const ports = getPort.makeRange(options.port, options.port + 100);
  const port = await getPort({ port: [options.port, ...ports] });
  const isNewPort = port !== options.port;

  options.port = port;

  await server(options);

  if (isNewPort) {
    console.warn(chalk.yellow(`Warning: port ${options.port} has been used.`));
  }
  const addr = `http://localhost:${port}`;
  console.log(`Server running at: ${chalk.blue(addr)}`);
}

bootstrap(commander.program.opts() as Options);
