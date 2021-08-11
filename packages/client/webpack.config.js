const path = require('path');
const webpack = require('webpack');
const dotenv = require("dotenv");

module.exports = (env, argv) => {
  dotenv.config({
    path: argv.mode === "production" ? "../../env/production.env" : "../../env/dev.env"
  });
  console.log("process.env.SOCKET_URL :", process.env.SOCKET_URL)

  return {
    mode: "none",
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, "../../public"),
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.SOCKET_URL': JSON.stringify(process.env.SOCKET_URL)
      })
    ]
  }
};