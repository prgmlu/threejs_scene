const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;
const TerserPlugin = require('terser-webpack-plugin');
const prodEnvs = ['production', 'client'];

const getMode = (env) => {
	if (prodEnvs.includes(env)) {
		return 'production';
	}

	return 'development';
};

const getPublicPath = (env = 'development', modulePath = '') => {
	if (env === 'development') {
		return 'http://192.168.1.122:4000/';
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
				'./TextObject': './src/Hotspot/_constructors/TextObject',
				'./InSceneVidComponent':
					'./src/in-scene-video/InSceneVidComponent',
				'./FireEffect': './src/fire-effect/FireEffect',
				'./WaterEffect': './src/water-effect/WaterEffect',
				'./InSceneImageComponent':
					'./src/in-scene-image/InSceneImageComponent',
				'./GreenScreenSystem':
					'./src/green-screen-system/GreenScreenSystem',
				'./AnimatedGLB': './src/AnimatedGLB',
				"./InteractiveGLB": "./src/interactive-glb/InteractiveGLBComponent",
				'./sceneUtils': './src/Scene/sceneUtils.js',
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

					test: /\.(glb|jpg|gltf|png|mp4)$/,
					use:
					[
						{
							loader: 'file-loader',
							options:
							{
								outputPath: 'assets/models/'
							}
						}
					]
				
				},
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

	if (prodEnvs.includes(buildEnv)) {
		config.optimization = {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: true,
						},
						mangle: true,
					},
				}),
			],
		};
	}
	return config;
};
