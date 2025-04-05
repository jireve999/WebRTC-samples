const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// HTTPS 证书配置
const certPath = './configs/server.crt';
const keyPath = './configs/server.key';

module.exports = {
  entry: './src/index.jsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: false // 适用于 Dart Sass 2.x+
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.*','.js', '.jsx'],
    // alias: {
    //   '@': path.resolve(__dirname, 'src'),
    //   public: path.resolve(__dirname, 'public')
    // }
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].[contenthash].js', // 添加哈希指纹
    chunkFilename: '[name].[contenthash].chunk.js' // 分割 chunk 命名规则
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // 更精确的 vendor 命名
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `vendors.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  performance: {
    maxEntrypointSize: 512 * 1024, // 提升警告阈值至512KB
    maxAssetSize: 512 * 1024
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'), // 绝对路径
      filename: 'index.html', // 输出文件名
      inject: 'body', // 脚本注入位置
      minify: false // 开发环境禁用压缩
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
      openAnalyzer: true
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: "configs", 
          to: "configs",
          noErrorOnMissing: true // 避免缺失文件时报错
        }
      ]
    }),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: [
    //     '**/*.js',       // 只清理 JS 文件
    //     '**/*.css',      // 清理 CSS 文件
    //     '!index.html',    // 保留 HTML 文件
    //     '!configs/**'     // 保留证书目录
    //   ]
    // })
  ],
  // ignoreWarnings: [
  //   { module: /node_modules\/antd/ }, 
  //   /Deprecation/,
  //   /legacy-js-api/
  // ],
  devServer: {
    // 新版配置方式
    static: {
      directory: path.join(__dirname, 'public'), // 替代 contentBase
      watch: true
    },
    server: {
      type: 'https', // HTTPS 配置
      options: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
        host: '0.0.0.0' // 替代旧版 host 配置
      }
    },
    client: {
      webSocketURL: {
        hostname: '0.0.0.0', // 解决局域网访问的 WebSocket 问题
        port: 8080
      }
    },
    compress: true,
    port: 8080,
    open: true,
    hot: true, // 'only', // 启用 HMR
    historyApiFallback: true // 解决路由问题
  },
};