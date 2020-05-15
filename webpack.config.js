const VueLoaderPlugin = require("vue-loader/lib/plugin");
module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.vue$/i,
                use: [
                    "vue-loader",
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
        loaders: [
            {
                test: /\.vue$/,
                loader: "vue",
            },
            {
                test: /\.s[a|c]ss$/,
                loader: "style!css!sass",
            },
        ],
    },
    vue: {
        loaders: {
            scss: "style!css!sass",
        },
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin(),
    ],
};
