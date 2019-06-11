// yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-jest

module.exports = {
  env: { node: true, es6: true },
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}
