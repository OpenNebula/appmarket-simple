const webpack = require('webpack');
const baseConfig = require('./webpack.config.js');

baseConfig.entry = ['webpack-hot-middleware/client', './src/index.js'];

baseConfig.plugins = baseConfig.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]);

module.exports = baseConfig;
