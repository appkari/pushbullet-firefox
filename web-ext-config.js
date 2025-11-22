module.exports = {
  sourceDir: './src',
  artifactsDir: './dist',
  ignoreFiles: ['.DS_Store', 'META-INF'],
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: 'firefoxdeveloperedition',
    startUrl: ['about:debugging#/runtime/this-firefox'],
    pref: [
      'extensions.experiments.enabled=true',
    ],
  },
};
