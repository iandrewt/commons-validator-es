// rollup.config.ts
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

const config = [
  {
    input: './tsc/index.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs', // commonJS
        plugins: [terser()],
      },
      {
        file: packageJson.main.replace('.min.', '.'),
        format: 'cjs',
      },
      {
        file: packageJson.module,
        format: 'es', // ES modules
        plugins: [terser()],
      },
      {
        file: packageJson.module.replace('.min.', '.'),
        format: 'es',
      },
    ],
    plugins: [typescript()],
    external: ['url'],
  },
  {
    input: './tsc/types/index.d.ts',
    output: [
      {
        file: packageJson.types,
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];

export default config;
