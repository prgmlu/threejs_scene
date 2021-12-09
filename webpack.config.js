const { ModuleFederationPlugin } = require('webpack').container;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const deps = require('./package.json').dependencies;

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
    const { buildEnv, modulePath } = env;

    const plugins = [
        new ModuleFederationPlugin({
            name: 'threejs_scene',
            filename: 'remoteEntry.js',
            exposes: {
                './lib': './src',
            },
            shared: {
                ...deps,
                react: {
                    requiredVersion: deps.react,
                    import: 'react',
                    shareKey: 'react',
                    shareScope: 'default',
                    singleton: true,
                },
                'react-dom': {
                    requiredVersion: deps['react-dom'],
                    singleton: true,
                },
            },
        }),
        new MiniCssExtractPlugin(),
    ];

    const config = {
        entry: './src/index.js',
        mode: getMode(buildEnv),
        devtool: 'source-map',
        output: {
            publicPath: getPublicPath(buildEnv, modulePath),
            clean: true,
        },
        resolve: {
            extensions: ['.jsx', '.js', '.json', '.css', '.scss'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins,
    };

    if (buildEnv === 'development') {
        config.devServer = {
            port: 3003,
        };
    }

    return config;
};
