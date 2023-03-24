// 参考https://cesium.com/blog/2016/01/26/cesium-and-webpack/
// https://www.jianshu.com/p/85917bcc023f

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV === 'prd' ? 'prd' : 'dev'

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

let config = {
  entry: './example/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // need to compile multi-line strings in Cesium
    sourcePrefix: ''
  },
  amd: {
      // Allow Cesium to be compatible with webpack's require method
      toUrlUndefined: true
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'cesium': path.resolve(__dirname, 'node_modules/cesium')
    },
    fallback: {
      fs: false,
      zlib: require.resolve("browserify-zlib"),
      assert: require.resolve("assert"),
      stream: require.resolve("stream-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test:/\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './example/index.html',
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSource, cesiumWorkers), to: 'cesium/Workers' },
        { from: path.join(cesiumSource, 'Assets'), to: 'cesium/Assets' },
        { from: path.join(cesiumSource, 'Widgets'), to: 'cesium/Widgets' },
      ],
    }),
    new webpack.DefinePlugin({
        // Relative paths for loading static resources in Cesium
        CESIUM_BASE_URL: JSON.stringify('cesium/')
    }),
    new webpack.HotModuleReplacementPlugin(), // Hot Update Plugin
  ],
  devServer: {
    static: './dist', // Instead of 'contentBase'
    hot: true, // Enable hot module replacement
    port: 9000
  }
};

if (NODE_ENV === 'dev') {
  config = Object.assign(config, {
    optimization: {
      minimize: false
    },
    devtool: "source-map"
  })
}

module.exports = config;
