import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import vitePluginReact from '@vitejs/plugin-react';
import type { ModuleFormat } from 'rollup';
import type { LibraryFormats, LibraryOptions, TerserOptions } from 'vite';
import vitePluginDts from 'vite-plugin-dts';
import vitePluginNoBundle from 'vite-plugin-no-bundle';
import { defineConfig, type UserConfig } from 'vitest/config';

import { getCliParams } from './scripts/vite/cli-params';
import { viteMinifyBundlesPlugin } from './scripts/vite/plugin-minify-bundles';
import { toKebabCase, toPascalCase } from './scripts/vite/utils';

type TCliParams = 'minify' | 'unbundled';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const cliParams = getCliParams<TCliParams>(process.argv, true);

const bundleFormats: LibraryFormats[] = ['es', 'umd'];

// Exposed to use in expanded configs
export const envParams = {
  dirname: __dirname,
  isBuildMode: false,
  isUnbundled: false,
  isMinify: false,
  isDts: false,
  isDebugConfig: false,
  terserOptions: {} as TerserOptions,
};

export default defineConfig((configEnv): UserConfig => {
  envParams.isBuildMode = configEnv.command === 'build';
  envParams.isUnbundled = envParams.isBuildMode && cliParams.has('unbundled');
  envParams.isMinify = envParams.isBuildMode && !envParams.isUnbundled && cliParams.has('minify');
  envParams.isDts = envParams.isBuildMode;
  envParams.isDebugConfig = false;

  const packageJsonPath = path.resolve(envParams.dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as Record<
    string,
    unknown
  >;
  const packageFilename = toKebabCase(packageJson.name as string);
  const packageNamespace = toPascalCase(packageJson.name as string);

  const baseConfig = {
    base: './',
    build: {
      target: 'es2015',
      outDir: './dist',
      emptyOutDir: false,
      cssCodeSplit: false,
      minify: envParams.isMinify ? 'terser' : false,
      terserOptions: envParams.terserOptions,
      sourcemap: true,
      lib: {
        entry: path.resolve(envParams.dirname, 'src/index.ts'),
        name: packageNamespace,
        formats: bundleFormats,
        fileName: ((format: LibraryFormats) => {
          return `${packageFilename}.${format}${envParams.isMinify ? '.min' : ''}.js`;
        }) as (format: ModuleFormat) => string,
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react/jsx-runtime': 'React',
            'react/jsx-dev-runtime': 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ['react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    resolve: {
      alias: [
        { find: '@core', replacement: path.resolve(envParams.dirname, '../../packages/core/src') },
      ],
    },
    plugins: [
      vitePluginReact(),
      envParams.isUnbundled && vitePluginNoBundle({ copy: '**/*.css' }),
      envParams.isDts &&
        vitePluginDts({
          // https://github.com/qmhc/vite-plugin-dts#options
          // Workaround for composite tsconfig with "references"
          tsconfigPath: path.resolve(envParams.dirname, 'tsconfig.app.json'),
          // Allow side effect imports
          clearPureImport: false,
          // See https://api-extractor.com/pages/configs/api-extractor_json/#bundledpackages
          bundledPackages: [],
          // Output to package.json "types" location
          rollupTypes: !envParams.isUnbundled,
        }),
      envParams.isMinify && viteMinifyBundlesPlugin(envParams.terserOptions),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [path.join(__dirname, './vitest.setup.ts')],
      include: ['src/**/__test__/**/*.ts?(x)', 'src/**/*.{test.ts?(x),test-d.ts}'],
    },
  } satisfies UserConfig;

  let mergedConfig: UserConfig = baseConfig;

  // Unbundled ESM
  if (envParams.isUnbundled) {
    const unbundledConfig = {
      build: {
        outDir: './dist/es',
        lib: {
          formats: ['es'],
          fileName: undefined,
        } as LibraryOptions,
      },
      plugins: [],
    } satisfies UserConfig;

    // Custom merging logic that differs from mergeConfig
    mergedConfig = {
      ...baseConfig,
      build: {
        ...baseConfig.build,
        ...unbundledConfig.build,
        lib: {
          ...baseConfig.build.lib,
          ...unbundledConfig.build.lib,
        },
      },
      plugins: [...baseConfig.plugins, ...unbundledConfig.plugins],
    };
  }

  if (envParams.isDebugConfig) {
    console.dir(mergedConfig, { depth: 4 });
  }

  return mergedConfig;
});
