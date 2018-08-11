const { join } = require('path');

module.exports = {
  entry: join(__dirname, 'fixtures/client.cljs'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /.cljs$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
