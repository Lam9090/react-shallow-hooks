const rollup = require('rollup');
const getOption = require('../config/rollup.base.js');
const rimraf = require('rimraf');
const buildTypes = ['CJS_DEV', 'CJS_PROD', 'ESM'];

async function build() {
  rimraf.sync('*(lib|types|esm)');
  for (const type of buildTypes) {
    const { inputOptions, outputOptions } = getOption(type);
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
  }
}

build();
