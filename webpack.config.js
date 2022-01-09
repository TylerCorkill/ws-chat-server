const path = require('path')

module.exports = {
  entry: './src/server.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // devServer: {
  //   // static: {
  //   //   directory: path.join(__dirname, 'public'),
  //   // },
  //   compress: true,
  //   port: 6000,
  // }
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}