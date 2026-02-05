const { merge } = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { IgnorePlugin } = require('webpack');

// CSS bundles
const bundledCssFiles = [
  path.join(process.cwd(), 'src/static-libraries/vendor/slick/css/smoothness/jquery-ui-1.8.16.custom.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/slick/slick.grid.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/bootstrap-datetimepicker.min.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/bootstrap-select.min.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/scxNumericField.min.css'),
  path.join(process.cwd(), 'src/static-libraries/vendor/chart/css/spectrum.min.css'),
  path.join(process.cwd(), 'src/styles.scss')
];

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['./node_modules'],
    alias: {
      img: path.join(process.cwd(), 'src/static/img/'),
      font: path.join(process.cwd(), 'src/static/font/')
    },
    mainFields: ['browser', 'module', 'main']
  },
  entry: {
    main: ['./src/main.ts'],    // Angular entry
    styles: bundledCssFiles     // CSS/SCSS entry
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        type: 'asset/resource',
        generator: { filename: 'static/font/[name][ext]', publicPath: '/app/static/font/' }
      },
      {
        test: /\.(jpg|png|webp|gif|otf|ani|ico|cur)$/,
        type: 'asset',
        parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
        generator: { filename: 'static/img/[name][hash:7][ext]', publicPath: '/app/static/img/' }
      },
      {
        exclude: bundledCssFiles,
        test: /\.css$/,
        use: ['exports-loader?module.exports.toString()', 'css-loader']
      },
      {
        include: bundledCssFiles,
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        include: bundledCssFiles,
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.ts$/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/touch-icon-iphone.png', to: '../', globOptions: { dot: true } }
      ]
    })
  ],
  experiments: { topLevelAwait: true }
};
