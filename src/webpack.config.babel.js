const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    mode: "production",
    entry: './popup/popup.js',
    target: 'web',
    externalsPresets: { node: true },
    output: {
        path: path.resolve("./popup/", 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [{ test: /\.txt$/, use: 'raw-loader' },
        {
            test: /\.html$/i,
            loader: "html-loader",
        }],
    },
    experiments: {
        topLevelAwait: true
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: { ascii_only: true },
                },
            }),
        ]
    },
    resolve: {
        fallback: {
            "fs": false,
            "child_process": false,
            "tls": false,
            "net": false,
            "os": require.resolve("os-browserify/browser"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "timers": require.resolve("timers-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "constants": require.resolve("constants-browserify")

        },
    },
    node: {
        global: false
    }
};