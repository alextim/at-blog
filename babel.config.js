module.exports = (api) => {
  api.cache(true);

  const presets = [
    'babel-preset-gatsby-package',
    /*
    [
      '@babel/env',
      {
        targets: {
          browsers: 'Last 2 Chrome versions, Firefox ESR',
          node: '14',
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        development: process.env.BABEL_ENV !== 'build',
      },
    ],
    */
  ];
  /*
  const plugins = [
    ['@babel/plugin-transform-modules-commonjs'],
    ['@babel/plugin-proposal-nullish-coalescing-operator'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-syntax-dynamic-import'],
  ];
  */
  // const env = {
  //  build: {
  //    ignore: ['**/*.test.tsx', '**/*.test.ts', '**/*.story.tsx', '__snapshots__', '__tests__', '__stories__'],
  //  },
  // };

  const ignore = ['node_modules', '**/__tests__', '`**/dist'];

  const babelrcRoots = ['.', 'packages/*'];

  return {
    babelrcRoots,
    presets,
    // plugins,
    // env,
    ignore,
  };
};
