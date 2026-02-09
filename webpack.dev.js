const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { SourceMapDevToolPlugin, DefinePlugin } = require('webpack');
const common = require('./webpack.common.js');
const { getOutputFolder, getCleanPlugin ,getPublicPath} = require('./i18n-helper');
const fs = require('fs');

const entryPoints = ['inline', 'polyfills', 'styles', 'main'];
const projectRoot = process.cwd();

module.exports = (env) => {
  const devConfig = merge(common, {
    mode: 'development',
    devtool: 'eval',
    output: {
      path: getOutputFolder(env, true),
      publicPath: './',
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js',
      crossOriginLoading: false
    },
    plugins: [
      getCleanPlugin(env, true),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        _g_prod: false,
        _g_version: JSON.stringify('0.0.0')
      }),
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: './index.html',
        hash: false,
        inject: true,
        compile: true,
        minify: false,
        chunks: 'all',
        excludeChunks: [],
        cache: false,
        favicon: false,
        showErrors: true,
        buildLanguage: env.locale,
        scriptBundleUrl: env.locale === "en" ? "/app/en/scripts.bundle.js" : "./scripts.bundle.js",
        title: env.locale === "en" ? "TickerChart Net" : "تكرتشارت نت",
        xhtml: true,
        chunksSortMode: (left, right) => {
          const leftIndex = entryPoints.indexOf(left.name);
          const rightIndex = entryPoints.indexOf(right.name);
          return leftIndex - rightIndex;
        }
      }),
      new CircularDependencyPlugin({
        exclude: /(\\|\/)node_modules(\\|\/)/,
        failOnError: false,
        cwd: projectRoot
      }),
      new SourceMapDevToolPlugin({
        filename: '[file].map[query]',
        moduleFilenameTemplate: '[resource-path]',
        fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
        sourceRoot: 'webpack:///'
      }),
      new ReplaceInFileWebpackPlugin([
        {
          dir: getOutputFolder(env, true),
          files: ['index.html'],
          rules: [
            {
              search: 'scripts.bundle.js',
              replace: function (match) {
                const files = fs.readdirSync(getOutputFolder(env, true));
                for (let f of files) {
                  if (f.startsWith('scripts.') && f.endsWith('.bundle.js')) return f;
                }
                return match;
              }
            }
          ]
        }
      ])
    ],
    optimization: { moduleIds: 'named' },
    node: false
  });

  return devConfig;
};
