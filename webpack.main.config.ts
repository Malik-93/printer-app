import webpack, { type Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new webpack.NormalModuleReplacementPlugin(
      /ngrok\/src\/constants\.js/,
      path.resolve(__dirname, "ngrok-constants-patch.js")
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "node_modules/ngrok/bin/ngrok",
          to: "bin",
          toType: "dir",
          transform(content, path) {
            // Ensure permissions are maintained
            return content;
          },
          info: {
            minimized: true,
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  // externals: {
  //   ngrok: "commonjs ngrok", // Exclude ngrok from bundling
  // },
};
