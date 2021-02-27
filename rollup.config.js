import { nodeResolve } from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import typescript from '@wessberg/rollup-plugin-ts';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/tdx-virtual-scroll.js',
    format: 'esm'
  },
  plugins: [
    nodeResolve(),
    serve({
      open: true,
      openPage: 'demo',
    }),
    typescript({
      tsconfig: 'tsconfig.json'
    })
  ]
};
