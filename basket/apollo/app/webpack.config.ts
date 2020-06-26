import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import path from "path";

type WebpackMode = "development" | "production";

const config: webpack.Configuration = {
  mode: (process.env.NODE_ENV as WebpackMode | undefined) || "production",
  entry: path.resolve(__dirname, "src", "index.ts"),
  target: "node",
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    devtoolModuleFilenameTemplate: "file:///[absolute-resource-path]"
  },
  module: {
    rules: [
      {
        test: /(\.ts)|(\.js)|(\.json)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(graphql|gql)$/,
        loader: "graphql-tag/loader"
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".mjs", "json"],
    alias: {
      "~": path.resolve(__dirname, "src")
    }
  },
  optimization: {
    nodeEnv: false,
    minimizer: [
      // not mangling solves https://github.com/graphql/graphql-js/issues/1182
      new TerserPlugin({ terserOptions: { mangle: false } })
    ]
  },
  plugins: []
};

export default config;
