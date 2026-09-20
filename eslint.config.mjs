import { defineConfig, globalIgnores } from 'eslint/config'
import nextConfig from 'eslint-config-next'

export default defineConfig([
  ...nextConfig,
  globalIgnores(['dist/**']),
  {
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'react/display-name': 'off'
    }
  }
])
