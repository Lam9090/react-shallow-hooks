import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const name = 'RollupTypeScriptBabel';

const getConfig = isProduction => ({
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
    isProduction?terser():false,
  ].filter(Boolean),

  output: [
    {
      file: `lib/${isProduction ? 'prod' : 'dev'}.js`,
      format: 'cjs',
    },
    // {
    //   file: `esm/${isProduction ? 'prod' : 'dev'}.js`,
    //   format: 'es',
    // },
  ],
});

export default getConfig;
