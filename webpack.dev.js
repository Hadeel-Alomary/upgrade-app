const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const common = require('./webpack.common.js');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { SourceMapDevToolPlugin, DefinePlugin } = require('webpack');
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

const entryPoints = ["inline", "polyfills", "sw-register", "styles", "scripts", "vendor", "main"];
const projectRoot = process.cwd();
const { getLocaleLang, getCleanPlugin, getLocaleFile, getOutputFolder, getPublicPath } = require("./i18n-helper");

const getDevelopmentConfig = (env) => {

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // MA if build is requested for build_element, then set the build element entry files
  let htmlWebpackPluginTemplate =
    // env.build_element
    // ? "./src\\app\\stock-chart-viewer\\element-index.ejs"
    // :
  "./src\\index.ejs";

  let angularWebpackPluginMainPath =
    // env.build_element
    // ? "app\\stock-chart-viewer\\element-main.ts"
    // :
  "main.ts";

  //*** if (env.build_element) {
  //   common.entry.main = ["./src\\app\\stock-chart-viewer\\element-main.ts"];
  //   common.entry.polyfills = ["./src\\app\\stock-chart-viewer\\element-polyfills.ts"];
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const devConfig = merge(common, {
    devtool: 'eval',
    output: {
      path: getOutputFolder(env, true),
      publicPath: './',
      filename: "[name].bundle.js",
      chunkFilename: "[id].chunk.js",
      crossOriginLoading: false
    },
    plugins: [
      getCleanPlugin(env, true),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["dev-nginx/app/static"]
      }),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        _g_prod: false,
        _g_version: JSON.stringify("0.0.0")
      }),
      new HtmlWebpackPlugin({
        template: htmlWebpackPluginTemplate,
        filename: "./index.html",
        hash: false,
        inject: true,
        compile: true,
        favicon: false,
        minify: false,
        cache: false,
        showErrors: true,
        chunks: "all",
        excludeChunks: [],
        title: env.locale === "en" ? "TickerChart Net" : "تكرتشارت نت",
        xhtml: true,
        buildLanguage: env.locale,
        redirectUrl: env.locale === "en" ? "/app/ar" : "/app/en",
        scriptBundleUrl: env.locale === "en"
          ? "/app/en/scripts.bundle.js"
          : "./scripts.bundle.js",
        chunksSortMode: (left, right) => {
          const leftName = left.names && left.names.length ? left.names[0] : left.id;
          const rightName = right.names && right.names.length ? right.names[0] : right.id;
          const leftIndex = entryPoints.indexOf(leftName);
          const rightIndex = entryPoints.indexOf(rightName);

          if (leftIndex === -1 && rightIndex === -1) return 0;
          if (leftIndex === -1) return 1;
          if (rightIndex === -1) return -1;
          return leftIndex - rightIndex;
        }
      }),
      new AngularWebpackPlugin({
        tsconfig: "./tsconfig.json",
        mainPath: angularWebpackPluginMainPath,
        sourceMap: false,
        skipCodeGeneration: env.locale === "ar",
        i18nInFile: getLocaleFile(env),
        i18nLocale: getLocaleLang(env),
        hostReplacementPaths: {
          "environments\\environment.ts": "environments\\environment.ts"
        }
      }),
      new CircularDependencyPlugin({
        exclude: /(\\|\/)node_modules(\\|\/)/,
        failOnError: false,
        onDetected: false,
        cwd: projectRoot
      }),
      new SourceMapDevToolPlugin({
        filename: "[file].map[query]",
        moduleFilenameTemplate: "[resource-path]",
        fallbackModuleFilenameTemplate: "[resource-path]?[hash]",
        sourceRoot: "webpack:///"
      }),
      new ReplaceInFileWebpackPlugin([{
        dir: getOutputFolder(env, true),
        files: ['index.html'],
        rules: [{
          search: 'scripts.bundle.js',
          replace: function (match) {
            const files = fs.readdirSync(getOutputFolder(env, true));
            for (let i = 0; i < files.length; i++) {
              if (files[i].startsWith("scripts.") && files[i].endsWith(".bundle.js")) {
                return files[i];
              }
            }
            return match;
          }
        }]
      }])
    ]
  });

  return devConfig;
};

module.exports = env => getDevelopmentConfig(env);
