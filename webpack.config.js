const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');





module.exports = (env, argv) => {
    const { mode } = argv;
    const devMode = mode === 'development';
    const buildMode = argv.env.build == true;



    //Plugins
    const pluginsArr=[new MiniCssExtractPlugin()];
    if(!buildMode){
        pluginsArr.push( new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'example/index.html'),
            inject: true,
        }));
    }




    const config = {
        mode,
        entry: buildMode ?  './src/index.js' : './example/index.js',
        // devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',

            //CommonJS
            // libraryTarget: 'commonjs2',

            //UMD
            libraryTarget: 'umd', //document undefined
            globalObject: 'this',
            // umdNamedDefine: true,

            clean: true,//erase old build
        },


        devServer: {
            host: 'localhost',
            port: 5555,
            publicPath: '/', //webpack output is served from /
            headers: {"Access-Control-Allow-Origin": "*"},
            historyApiFallback: true,
            disableHostCheck: true,
            open: true, //Opens the browser after launching the dev server.
            hot: true,
        },


        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    // exclude: /(node_modules|example)/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],

                    // use: {
                    //     loader:'babel-loader'
                    // }
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
        // Enable rules only on compilation/build mode
        externals: buildMode ? {
            // 'react': 'commonjs react'
            react: {
                root: "React",
                commonjs: "react",
                commonjs2: "react",
                amd: "react"
            },
            "react-dom": {
                root: "ReactDOM",
                commonjs: "react-dom",
                commonjs2: "react-dom",
                amd: "react-dom",
            },
            // 'prop-types': {
            //     root: 'PropTypes',
            //     commonjs2: 'prop-types',
            //     commonjs: 'prop-types',
            //     amd: 'prop-types'
            // }
        }:{},

        plugins:pluginsArr
    };

    return config;
};