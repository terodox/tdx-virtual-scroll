import config from './rollup.config';
import serve from 'rollup-plugin-serve'

export default {
  ...config,
  plugins: [
    ...config.plugins,
    serve({
      open: true,
      openPage: 'demo',
    }),
  ]
};
