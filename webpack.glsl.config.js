const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'packages/shader/index.js'),
  output: {
    path: path.join(__dirname, 'src/shader/'),
    filename: 'shader.min.js',
    libraryTarget: 'commonjs'  // Module output method
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  }
};
