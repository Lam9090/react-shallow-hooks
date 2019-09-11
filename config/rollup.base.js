const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const { terser } = require('rollup-plugin-terser');
const copy = require('rollup-plugin-copy');
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const getConfig = ENV => {
  const isProduction = ENV === 'NODE_PROD';
  const inputOptions = {
    input: 'src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: ['react'],

    plugins: [
      commonjs({
        namedExports: { react: ['useRef'] },
      }),

      // Allows node_modules resolution
      resolve({ extensions }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs

      // Compile TypeScript/JavaScript files
      babel({ extensions, include: ['src/**/*'], exclude: ['src/__tests__/*'] }),

      replace({
        'process.env.NODE_ENV': isProduction ? "'production'" : "'development'",
      }),
      copy({
        targets: [
          {
            src: 'shim/index.js',
            dest: 'lib/',
          },
        ],
      }),
      isProduction ? terser() : false,
    ].filter(Boolean),
  };
  const outputOptions = {
    file: `lib/${isProduction ? 'prod' : 'dev'}.js`,
    format: 'cjs',
  };
  return {
    outputOptions,
    inputOptions,
  };
};

module.exports = getConfig;
