var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');

var PLUGINS = [];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new UglifyJSPlugin());
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build/build.js'
  },
  plugins: PLUGINS
};
