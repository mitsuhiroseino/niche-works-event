import createExternalOptionFunction from '@niche-works/dev/createExternalOptionFunction';
import distPackage from '@niche-works/rollup-plugin-dist-package';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.{ts,tsx}',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  unbundle: true,
  sourcemap: false,
  clean: true,
  outDir: 'dist',
  minify: false,
  inputOptions: {
    external: createExternalOptionFunction(),
  },
  outputOptions: {
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  plugins: [
    distPackage({
      content: {
        main: './index.cjs',
        module: './index.mjs',
        exports: {
          '.': {
            import: './index.mjs',
            require: './index.cjs',
          },
          './EventDispatcher': {
            import: './EventDispatcher/index.mjs',
            require: './EventDispatcher/index.cjs',
          },
          './types': {
            import: './types.mjs',
            require: './types.cjs',
          },
        },
      },
    }),
  ],
});
