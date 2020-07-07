const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExatractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "../index.html"
        }),
        new MiniCssExatractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
}



