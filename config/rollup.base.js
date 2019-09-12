const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const { terser } = require('rollup-plugin-terser');
const copy = require('rollup-plugin-copy');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const getConfig = buildTypes => {
  const output = buildTypes => {
    switch (buildTypes) {
      case 'CJS_PROD':
        return {
          file: `lib/prod.js`,
          format: 'cjs',
        };
      case 'CJS_DEV':
        return {
          file: `lib/dev.js`,
          format: 'cjs',
        };
      case 'ESM':
        return {
          file: `esm/index.js`,
          format: 'esm',
        };
      default:
        throw Error('Unexpected buildTypes :' + buildTypes);
    }
  };
  const getPlugins = buildTypes => {
    const basePlugins = [
      commonjs({
        namedExports: { react: ['useRef'] },
      }),
      // Allows node_modules resolution
      resolve({ extensions }),
      // Allow bundling cjs modules. Rollup doesn't understand cjs
      // Compile TypeScript/JavaScript files
      babel({ extensions, include: ['src/**/*'], exclude: ['src/__tests__/*'] }),
    ];
    switch (buildTypes) {
      case 'CJS_PROD':
        return basePlugins.concat([
          replace({
            'process.env.NODE_ENV': "'production'",
          }),
          terser(),
          copy({
            targets: [
              {
                src: 'shim/index.js',
                dest: 'lib/',
              },
            ],
          }),
        ]);
      case 'CJS_DEV':
        return basePlugins.concat([
          replace({
            'process.env.NODE_ENV': "'development'",
          }),
        ]);
      default:
        return basePlugins;
    }
  };
  const inputOptions = {
    input: 'src/index.ts',
    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: ['react'],
    plugins: getPlugins(buildTypes),
  };

  const outputOptions = output(buildTypes);
  return {
    outputOptions,
    inputOptions,
  };
};

module.exports = getConfig;
