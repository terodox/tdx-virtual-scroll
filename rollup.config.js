import typescript from '@wessberg/rollup-plugin-ts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/tdx-virtual-scroll.js',
    format: 'esm'
  },
  plugins: [nodeResolve(), typescript()]
};
