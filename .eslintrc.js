/**@type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['brad'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-void': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      // basic camel case style
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        // to allow unused parameters
        leadingUnderscore: 'allow',
      },

      {
        selector: [
          'class',
          'interface',
          'typeAlias',
          'enum',
          'typeParameter',
          'enumMember',
        ],
        format: ['PascalCase'],
      },

      // enforce interfaces _don't_ start with an I
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      // enforce that generics start with a T
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
    ],
  },
};
