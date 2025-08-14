import * as path from 'node:path';
import * as url from 'node:url';

import { mergeConfig } from 'vite';
import { defineConfig, type UserConfig } from 'vitest/config';

import getBaseConfig, { envParams } from '../../vite.base-config';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
envParams.dirname = __dirname;

export default defineConfig((configEnv) => {
  const baseConfig = getBaseConfig(configEnv);
  const mergedConfig: UserConfig = mergeConfig(baseConfig, {});

  return mergedConfig;
});
