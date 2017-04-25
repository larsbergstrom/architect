require('webpack');
var path = require('path');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var PLUGINS = [];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new UglifyJSPlugin());
}

module.exports = {
  devtool: '#inline-source-map',
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build/build.js'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    alias: {
      react: 'preact'
    },
    modules: [
      path.join(__dirname, 'node_modules')
    ]
  }
};
