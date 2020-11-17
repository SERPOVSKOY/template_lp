const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const PATHS = {
    source: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
};

const GetTimestamp = () => {
    const correctNumber = (number) => (number < 10 ? `0${number}` : number);
    const now = new Date();
    const time = {
        year: now.getFullYear(),
        month: correctNumber(now.getMonth() + 1),
        day: correctNumber(now.getDate()),
        hours: correctNumber(now.getHours()),
        minutes: correctNumber(now.getMinutes()),
    };

    return `${time.year}-${time.month}-${time.day}-${time.hours}${time.minutes}`;
};

const cssDev = [
    'style-loader',
    'css-loader',
    'postcss-loader',
    'stylus-loader',
];

const cssProd = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../',
        },
    },
    'css-loader',
    'postcss-loader',
    'stylus-loader',
];

const isDev = process.env.NODE_EVN === 'development';
const isProd = !isDev;

module.exports = {
    mode: 'development',
    devtool: isProd ? false : 'cheap-module-source-map',
    entry: `${PATHS.source}/static/js/index.js`,
    output: {
        filename: 'bundle.js',
        path: PATHS.dist,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/env'],
                        },
                    },
                ],
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
            },
            {
                test: /\.styl$/,
                use: isProd ? cssProd : cssDev,
            },
            {
                test: /\.(webmanifest|xml)$/,
                use: 'url-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[ext]',
                            fallback: 'file-loader',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 75,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: `${PATHS.dist}`,
        }),
        new HtmlWebpackPlugin({
            template: `${PATHS.source}/pages/index.pug`,
            filename: 'index.html',
            hash: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/styles.css',
        }),
        new ZipPlugin({
            filename: `web-site-${GetTimestamp()}.zip`,
        }),
    ],
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            Custom: path.resolve(__dirname, 'src/custom/'),
        },
    },
    devServer: {
        port: 8080,
        hot: isDev
    },
};
