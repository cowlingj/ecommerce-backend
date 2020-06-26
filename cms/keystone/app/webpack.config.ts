import path from 'path'
import nodeExternals from 'webpack-node-externals'

export default {
  entry: {
    index: './src/index.ts',
    main: './src/main.ts'
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
  mode: 'none',
  target: 'node',
  node: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  optimization: {
    minimize: false, //process.env.NODE_ENV !== 'development'
    nodeEnv: false
  },
  externals: nodeExternals(),
}