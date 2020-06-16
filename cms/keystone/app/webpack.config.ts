import path from 'path'
import nodeExternals from 'webpack-node-externals'

const {
  NODE_ENV = 'production',
} = process.env;

export default {
  entry: {
    index: './src/index.ts',
    main: './src/main.ts'
  },
  devtool: NODE_ENV === 'development' ? 'source-map' : undefined,
  mode: NODE_ENV,
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
  externals: nodeExternals(),
}