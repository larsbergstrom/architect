require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var PLUGINS = [
  new HTMLWebpackPlugin({
    inject: false,
    template: 'src/index.html'
  })
];
if (process.env.NODE_ENV === 'production') {
  PLUGINS.push(new UglifyJSPlugin());
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'build/build.js'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {test: /\.html/, loader: 'ejs-compiled-loader'},
    ]
  }
};
