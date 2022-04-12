const webpack = require('webpack');
const path = require('path');
const typescriptIsTransformer = require('typescript-is/lib/transform-inline/transformer').default;

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
        fallback: {
            // for typescript-is
            util: require.resolve('util/'),
        },
    },
    devServer: {
        compress: true,
        static: './',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({}),
            SDK_VERSION: `"${require('./package.json').version}"`,
        }),
    ],
};

module.exports = config;
