const HardSourceWebpackPlugin = require("hard-source-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const isDev = process.env.NODE_ENV === "dev";
console.log("building in dev mode? ", isDev);

module.exports = {
    context: __dirname + '/src',
    mode: isDev ? "development":"production",
    devtool: isDev ? "cheap-module-eval-source-map":false,
    devServer: {
        contentBase: __dirname + '/dist',
        watchContentBase: true,
        compress: true,
        bonjour: true,
        clientLogLevel: 'debug',
        port: 3001
    },
    optimization: {
        minimize: isDev ? false:true
    },
    entry: {
        main: "./index.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: "index.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [ 'html-loader' ]
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpeg|ttf|woff|woff2|...)$/,
                use: [ { loader: 'url-loader' } ]
            }

        ],
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new HtmlWebpackPlugin({ template: "./index.html" })
    ]
}
