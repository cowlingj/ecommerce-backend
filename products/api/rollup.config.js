import graphql from 'rollup-plugin-graphql'
import copy from 'rollup-plugin-copy'

import pkg from './package.json'

export default {
  input: './index.js',
  output: {
    file: pkg.main,
    format: 'cjs'
  },
  plugins: [
    copy({ targets: [{ src: './index.d.ts', dest: './dist/' }] }),
    graphql(),
  ],
}

