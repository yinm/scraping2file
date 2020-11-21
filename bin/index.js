#!/usr/bin/env node

const { main } = require("../");
const { init } = require("../src/init");
const cli = require("cac")();

if (process.argv.length === 2) {
  (async () => {
    await main();
  })();
}

cli.command("init", "Create files for execution").action(async () => {
  await init();
});

cli.usage("[command]");
cli.help();
cli.version(require("../package.json").version);

cli.parse();
