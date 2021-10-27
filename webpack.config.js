const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, args)=>{
    const { mode } = args;

    console.log('>>webpack', {mode, env, args});
    // const plugins=[];
    // if(mode === 'production') plugins.push(new MiniCssExtractPlugin());

    return {
        mode: mode, //production,development
        entry: './src',
        // devtool: 'source-map',
        // styles: './src/styles.ts'
        output: {
            path: path.resolve('lib'),
            filename: 'index.js',
            // filename: mode === 'production' ? libraryName + '.min.js' : libraryName + '.js',
            libraryTarget: 'commonjs2', //or commonjs2, umd
            clean: true,
        },
        plugins: [new MiniCssExtractPlugin()],
        // plugins: [],

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader:'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    // options: {
                    // 	presets: ['react']
                    // }
                },
                // {
                //     // test: /\.css$/i,
                //     test: /\.(sa|sc|c)ss$/,
                //     use: [MiniCssExtractPlugin.loader, 'css-loader']
                // },
                {
                    // test: /\.css$/i,
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "sass-loader",
                    ]
                },
            ]
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
    };
}