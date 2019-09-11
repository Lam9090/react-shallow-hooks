const rollup = require('rollup');
const getOption = require('../config/rollup.base.js');
const buildTypes = ['NODE_DEV', 'NODE_PROD'];

async function build() {
  for (const type of buildTypes) {
    const { inputOptions, outputOptions } = getOption(type);
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
  }
}

build();
