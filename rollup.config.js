import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@wessberg/rollup-plugin-ts';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/tdx-virtual-scroll.js',
    format: 'esm'
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: 'tsconfig.json'
    }),
    uglify()
  ]
};
