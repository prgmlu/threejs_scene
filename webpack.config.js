const { IgnorePlugin } = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// let libraryName = 'index';




module.exports = (env, argv) => {
    const { mode } = argv;
    const devMode = mode === 'development';
    const buildMode = argv.env.build == true;
    const APP_ENV = buildMode ? 'production' : mode;


    const pluginsArr=[new MiniCssExtractPlugin()];




    if(buildMode){
        // pluginsArr.push(new IgnorePlugin({
        //     resourceRegExp: /example/,
        // }));
    }else{
        pluginsArr.push( new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'example/index.html'),
            // filename: 'index.html',
            inject: true,
        }));
    }




    const config = {
        mode: argv.mode,
        entry: buildMode ?  './src/index.js' : './example/App/index.js',
        // devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            libraryTarget: 'commonjs2', //document undefined
            clean: true,//erase old build
        },


        devServer: {
            host: 'localhost',
            port: 5555,
            publicPath: '/', //webpack output is served from /
            headers: {"Access-Control-Allow-Origin": "*"},
            historyApiFallback: true,
            disableHostCheck: true,
            // open: true, //Opens the browser after launching the dev server.
            hot: true,
        },


        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,

                    //harmony export
                    use: {
                        loader:'babel-loader',
                    },

                    // use: ['babel-loader'],

                },

                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "sass-loader",
                    ]
                },
            ],
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                'react': path.resolve(path.join(__dirname, './node_modules/react')),
                'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
            }
        },

        // Don't bundle react or react-dom
        externals: {
            react: {
                commonjs: "react",
                commonjs2: "react",
                amd: "React",
                root: "React"
            },
            "react-dom": {
                commonjs: "react-dom",
                commonjs2: "react-dom",
                amd: "ReactDOM",
                root: "ReactDOM"
            }
        },

        plugins:pluginsArr
    };

    return config;
};