const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/js/main.js'],
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'script.js',
  },
  mode: 'development',
};
