const webpack = require('webpack');
const path = require('path');
const typescriptIsTransformer = require('typescript-is/lib/transform-inline/transformer').default;
const TerserPlugin = require('terser-webpack-plugin');

const config = {
    entry: {
        RSS3: './src/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'browser'),
        filename: '[name].js',
        library: {
            name: '[name]',
            type: 'umd',
            export: 'default',
            umdNamedDefine: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            getCustomTransformers: (program) => ({
                                before: [typescriptIsTransformer(program)],
                            }),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        // hack for web3-eth-accounts
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer/'),
            assert: require.resolve('assert/'),
            https: require.resolve('https-browserify'),
            http: require.resolve('stream-http'),
            os: require.resolve('os-browserify/browser'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    devServer: {
        compress: true,
        static: './',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    output: {
                        ascii_only: true,
                    },
                },
            }),
        ],
    },
};

module.exports = config;
