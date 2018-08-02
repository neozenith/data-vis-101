'use strict';

// https://vxcompany.com/2017/10/17/getting-started-with-typescript-and-webpack/#3

// const webpack = require('webpack');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/client/index.ts'),

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/client')
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new CopyWebpackPlugin([{ from: path.resolve(__dirname, 'static') }])],

  externals:{}
};
