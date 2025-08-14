// @ts-check
import * as path from 'node:path';
import * as url from 'node:url';

import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslint from 'typescript-eslint';

import rootConfig from '../../eslint.config.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default typescriptEslint.config(
  ...rootConfig,

  {
    files: ['**/*.?([cm])ts?(x)', '**/*.?([cm])js?(x)'],
    // Overriding languageOptions.parserOptions.tsconfigRootDir
    // Not merged with root config, needs to be completely specified
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.lint.json'],
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
);
