import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import path from "path";

type WebpackMode = "development" | "production" | "none" | undefined;

const config: webpack.Configuration = {
  mode: process.env.NODE_ENV as WebpackMode,
  entry: path.resolve(__dirname, "src", "index.ts"),
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /(\.ts)|(\.js)$/,
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
  devtool:
    (process.env.NODE_ENV as WebpackMode) === "development"
      ? "inline-cheap-module-source-map"
      : false,
  resolve: {
    extensions: [".ts", ".js", ".mjs", "json"],
    alias: {
      "@": path.resolve(__dirname, "src")
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
