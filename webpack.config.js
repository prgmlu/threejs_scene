const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require('../package.json').dependencies;

const getMode = (env) => {
    if (env === 'production') {
        return env;
    }
    return 'development';
};

const getPublicPath = (env = 'development', modulePath = '') => {
    if (env === 'development') {
        return 'http://localhost:3003/';
    }
    return `https://modules.obsess-vr.com/${modulePath}/`;
};


module.exports = (env) => {
    const { buildMode, buildEnv, modulePath } = env;
    // const buildMode = argv.env.build === true;
    //Plugins
    const pluginsArr=[new MiniCssExtractPlugin()];
    if(!buildMode){
        pluginsArr.push( new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'example/index.html'),
            inject: true,
        }));
    }

    pluginsArr.push(new ModuleFederationPlugin({
        name: "threejs_scene",
        filename: "remoteEntry.js",
        exposes:{
            "./lib": "./src"
        },
        shared: {
            react: {
                shareScope: 'default',
                singleton: true,
            },
            'react-dom': {
                singleton: true,
            },
            three: {
                import: "three",
                singleton: true,
                shareScope: "default",
                requiredVersion: '0.114.0'
            },
        }
    }));

    const config = {
        mode: getMode(buildEnv),
        entry: buildMode ?  './src/index.js' : './example/index.js',
        // devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.js',
            publicPath: getPublicPath(buildEnv, modulePath),
            //UMD
            libraryTarget: 'umd', //document undefined
            globalObject: 'this',
            // umdNamedDefine: true,
            clean: true,//erase old build
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
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
            // alias: {
            //     'react': path.resolve(path.join(__dirname, './node_modules/react')),
            //     'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
            // }
        },

        // Don't bundle react or react-dom
        // Enable rules only on compilation/build mode
        // externals: buildMode ? {
        //     react: {
        //         root: "React",
        //         commonjs: "react",
        //         commonjs2: "react",
        //         amd: "react"
        //     },
        //     "react-dom": {
        //         root: "ReactDOM",
        //         commonjs: "react-dom",
        //         commonjs2: "react-dom",
        //         amd: "react-dom",
        //     },
        // }:{},

        plugins:pluginsArr,
    };

    if (buildEnv === 'development') {
        config.devServer = {
            host: '0.0.0.0',
            port: 4000,
            publicPath: '/', //webpack output is served from /
            headers: {"Access-Control-Allow-Origin": "*"},
            historyApiFallback: true,
            disableHostCheck: true,
            // open: true, //Opens the browser after launching the dev server.
            hot: true,
        };
    }

    return config;
};
