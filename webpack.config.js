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





   if(devMode ) {
       if(buildMode){
           pluginsArr.push(new IgnorePlugin({
               resourceRegExp: /example/,
           }));
       }
        else{
           pluginsArr.push( new HtmlWebPackPlugin({
               template: path.resolve(__dirname, 'example/index.html'),
               // filename: 'index.html',
               inject: true,
           }));
        }


   }


    const config = {
        mode: argv.mode,
        entry: buildMode ?  './src/index.js' : './example/App/index.js',
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            filename: mode === 'production' ? 'index.min.js' :  'index.js',
            libraryTarget: 'commonjs2', //document undefined
            umdNamedDefine: true,
            clean: true,//erase old build
        },


        devServer: {
            host: 'localhost',
            port: 5555,
            publicPath: '/', //webpack output is served from /
            headers: {"Access-Control-Allow-Origin": "*"},
            // build & public files available as HOST/
            // contentBase: [
                // path.join(__dirname, 'build'), //serve build files
            // ],

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
                // {
                //     test: /\.(sa|sc|c)ss$/,
                //     use: ['style-loader', 'css-loader', 'sass-loader'],
                // },
            ],
        },

        resolve: {
            extensions: ['*', '.js', '.jsx'],
            modules: [
                path.resolve('./node_modules'),
                path.resolve('./src'),
                // path.resolve('./example'),
            ],
        },

        // Don't bundle react or react-dom
        externals: {
            // react: 'react',
            // 'react-dom': 'react-dom',
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