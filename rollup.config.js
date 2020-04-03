import fs from 'fs';
import path from 'path';
import pkg from './package.json';

import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const isProduction = process.env.NODE_ENV === 'production';
const prodPlugins = [cleanup(), terser()];

const outputs = [
  {
    name: 'main',
    format: 'cjs',
    esModule: false,
  },
  {
    name: 'module',
    format: 'esm',
    esModule: true,
  },
];

export default {
  input: fs
    .readdirSync(path.resolve(__dirname, 'src'))
    .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
    .map(file => `src/${file}`),
  output: outputs.map(({ esModule, name, format }) => ({
    format,
    esModule,
    entryFileNames: '[name].js',
    dir: pkg[name],
  })),
  plugins: [
    babel({
      exclude: /node_modules/,
    }),
    external(),
    resolve(),
    typescript(),
    ...(isProduction ? prodPlugins : []),
  ],
};
