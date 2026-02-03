import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['shared/utils/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: 'tsconfig.build.json',
  target: 'es2022',
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  splitting: false,
  treeshake: true,
  external: ['react', 'react-dom', 'next'],
});
