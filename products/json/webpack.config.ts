import webpack from "webpack";
import path from "path";

type WebpackMode = "development" | "production" | "none";

const config: webpack.Configuration = {
  mode: (process.env.NODE_ENV || "production") as WebpackMode,
  entry: path.resolve(__dirname, "src", "index.ts"),
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /(\.ts)|(js)|(\.json)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
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
  plugins: []
};

export default config;
