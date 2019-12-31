const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/components/index/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['dynamic-import-node-babel-7'],
                    },
                },
            }, {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' },
            }, {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        removeComments: false,
                        collapseWhitespace: false,
                        interpolate: true,
                    },
                },
            }, {
                test: /\.(scss|sass|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false, sourceMap: true } },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Some Basic Components',
            template: './src/components/index/index.html',
            filename: './index.html', // relative to root of the application
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: '[id].css',
        }),
        new ScriptExtHtmlWebpackPlugin({
            preload: /\.js$/,
            defaultAttribute: 'defer',
        }),
    ],
};
