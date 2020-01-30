import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

const extensions = [ '.ts', '.gql' ]

export default {
  input: './src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs'
  },
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({ exclude: 'node_modules/**', extensions })
  ],
  external: [
    'graphql-tools',
    'graphql',
    'graphql/language',
    'util',
    'is-subset'
  ]
};

