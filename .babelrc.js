const { STYLE_IDENT_NAME } = require('./config/constants');

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: 'cover 95%, safari >= 7',
        modules: 'cjs',
        corejs: { version: 3, proposals: true },
        useBuiltIns: 'usage',
      },
    ],
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'react-css-modules',
      {
        exclude: 'node_modules',
        generateScopedName: STYLE_IDENT_NAME,
        handleMissingStyleName: 'warn',
        filetypes: {
          '.less': {
            syntax: 'postcss-less',
          },
        },
      },
    ],
  ],
};
