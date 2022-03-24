const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

const getMode = (env) => {
	const prodEnvs = ['production', 'client'];
	if (prodEnvs.includes(env)) {
		return 'production';
	}

	return 'development';
};

const getPublicPath = (env = 'development', modulePath = '') => {
	if (env === 'development') {
		return 'http://localhost:4000/';
	}
	return `https://modules.obsess-vr.com/${modulePath}/`;
};

module.exports = (env) => {
	const { buildMode, buildEnv, modulePath } = env;
	// const buildMode = argv.env.build === true;
	//Plugins
	const pluginsArr = [new MiniCssExtractPlugin()];
	if (!buildMode) {
		pluginsArr.push(
			new HtmlWebPackPlugin({
				template: path.resolve(__dirname, 'example/index.html'),
				inject: true,
			}),
		);
	}

	pluginsArr.push(
		new ModuleFederationPlugin({
			name: 'threejs_scene',
			filename: 'remoteEntry.js',
			exposes: {
				'./Scene': './src/Scene',
				'./Hotspot': './src/Hotspot',
				'./InSceneVidComponent':
					'./src/in-scene-video/InSceneVidComponent',
			},
			shared: {
				...deps,
				react: {
					shareScope: 'default',
					singleton: true,
				},
				'react-dom': {
					singleton: true,
				},
				three: {
					import: 'three',
					singleton: true,
					shareScope: 'default',
					requiredVersion: '0.137.0',
				},
			},
		}),
	);

	const config = {
		mode: getMode(buildEnv),
		entry: buildMode ? './src/index.js' : './example/index.js',
		devtool: 'source-map',
		output: {
			filename: 'index.js',
			publicPath: getPublicPath(buildEnv, modulePath),
			//UMD
			libraryTarget: 'umd', //document undefined
			clean: true, //erase old build
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
						'css-loader',
						'postcss-loader',
						'sass-loader',
					],
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
		},
		plugins: pluginsArr,
	};

	if (buildEnv === 'development') {
		config.devServer = {
			host: '0.0.0.0',
			port: 4000,
			publicPath: '/', //webpack output is served from /
			headers: { 'Access-Control-Allow-Origin': '*' },
			historyApiFallback: true,
			disableHostCheck: true,
			// open: true, //Opens the browser after launching the dev server.
			hot: true,
		};
	}

	return config;
};
