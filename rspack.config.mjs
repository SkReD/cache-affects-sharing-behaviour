import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { rspack } from '@rspack/core';
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

const cacheReadWriteAndNoSharing = process.env.CACHE_READ_WRITE_AND_NO_SHARING
const cacheReadAndSharing = process.env.CACHE_READ_ONLY_AND_SHARING

let cacheConfig
let plugins = []
if (cacheReadWriteAndNoSharing) {
  if (isRunningRspack) {
    /**
     * @type {import('@rspack/cli').Configuration['cache']}
     */
    cacheConfig = {
      type: 'persistent'
    }
  } else {
        /**
     * @type {import('webpack').Configuration['cache']}
     */
    cacheConfig = {
      type: 'filesystem'
    }
  }
} else if (cacheReadAndSharing) {
  if (isRunningRspack) {
    /**
     * @type {import('@rspack/cli').Configuration['cache']}
     */
    cacheConfig = {
      type: 'persistent',
      readonly: true,
    }
    plugins.push(new rspack.container.ModuleFederationPlugin({
      shared: ['lodash-es'] 
    }))
  } else {
        /**
     * @type {import('webpack').Configuration['cache']}
     */
    cacheConfig = {
      type: 'filesystem',
      readonly: true,
    }
    plugins.push(new webpack.container.ModuleFederationPlugin({
      shared: ['lodash-es']
    }))
  }
}


/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "production",
  devtool: false,
  entry: {
    main: "./src/index",
  },
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
    library: {
      type: 'commonjs'
    }
  },
  cache: cacheConfig,
  plugins
};

export default config;
