import React, { Component } from 'react';
import GLBObj from './GLBObj.jsx';

// import React, { Component } from 'react';

import * as THREE from 'three';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';

import { RGBELoader } from '../../node_modules/three/examples/jsm/loaders/RGBELoader.js';

import SceneModal from './SceneModal.jsx';

const lashesUrl =
	'https://cdn.obsess-vr.com/charlotte-tilbury/PushUpLashes_anim_v006.glb';
const creamUrl =
	'https://cdn.obsess-vr.com/charlotte-tilbury/MagicCream_anim_v009.glb';
const matteUrl =
	'https://cdn.obsess-vr.com/charlotte-tilbury/MatteRevolution_anim_v004.glb';

const TWEEN = require('@tweenjs/tween.js');

const isMobileDevice = function () {
	const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
	return touch;
};

// const CUSTOM_OBJ = true;
// const CUSTOM_OBJ = false;

const objsPosConfig = {
	//disco-game
	// 6242242a42f102f9875fa895
	'6242242a42f102f9875fa895': {
		cream: [5, -0.4, -0.1],
		lashes: [-0.8, 0.2, 5],
		matte: [-1.3, -0.3, -5],
	},

	//disco-bts
	// 624221a9daa2aa92c9fd575f
	'624221a9daa2aa92c9fd575f': {
		cream: [-1.2, -0.6, 5],
		lashes: [-1.2, 0.3, -5],
		matte: [5, -0.5, 0],
	},

	//disco-masterclass
	// 623b5325b452e0eb474fd84f
	'623b5325b452e0eb474fd84f': {
		cream: [-1.3, -0.7, -5],
		lashes: [5, 0.4, -0.3],
		matte: [-0.901, -0.5, 5],
	},
};

class AnimatedGLBs extends Component {
	constructor(props) {
		super(props);
		// if (window.animatedGlbsConstructed) {
		// 	window.constructionCount+=1;
		// 	this.myCount = window.constructionCount;

		// 	if(window.constructionCount > 1)
		// 		return

		// }else{
		// 	window.animatedGlbsConstructed = true;
		// 	window.constructionCount = 1;
		// 	this.myCount = 1;
		// }

		this.state = {
			modelsLoaded: false,
		};

		this.creamLoaded = false;
		this.lashesLoaded = false;
		this.matteLoaded = false;

		this.cream = null;
		this.lashes = null;
		this.matte = null;


		// this.setEnvMap(props.sceneRef.current);

		this.setCanTween = this.setCanTween.bind(this);
		this.setCanClick = this.setCanClick.bind(this);
		this.animate = this.animate.bind(this);
		this.setEnvMap = this.setEnvMap.bind(this);
		this.setSceneModalVisible = this.setSceneModalVisible.bind(this);

		this.state = {
			sceneModalVisible: false,
			canTween: true,
			canClick: true,
		};
		if (!window.rotationAnim) {
			window.rotationAnim = true;
			// this.animate();
		}
	}

	// shouldComponentUpdate(){
	// return false;
	// }

	setEnvMap(scene) {
		var rgbeLoader = new RGBELoader();
		rgbeLoader.load(
			'https://cdn.obsess-vr.com/charlotte-tilbury/Footprint_Court_Env_v002.hdr',
			(texture) => {
				const generator = new THREE.PMREMGenerator(window['containerInstance_renderer']);
				generator.compileEquirectangularShader();
				var envMap = generator.fromEquirectangular(texture).texture;
				scene.environment = envMap;
			},
		);
	}

	componentWillUpdate(nextProps, nextState) {
		if (window.constructionCount > 1) return;
		// this.setEnvMap(nextProps.sceneRef.current);
	}

	animate() {
		requestAnimationFrame(this.animate);
		if (window.outerObjs) {
			for (var i = 0; i < window.outerObjs.length; i++) {
				window.outerObjs[i].rotation.y += 0.01;
			}
		}
	}

	setSceneModalVisible(val) {
		this._mounted &&
			this.setState({
				sceneModalVisible: val,
			});
	}
	setCanTween(val) {
		this._mounted &&
			this.setState({
				canTween: val,
			});
	}
	setCanClick(val) {
		this._mounted &&
			this.setState({
				canClick: val,
			});
	}

	componentDidMount() {
		this._mounted = true;

		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath(
			'https://cdn.obsess-vr.com/charlotte-tilbury/gltf/',
		);
		loader.setDRACOLoader(dracoLoader);

		loader.crossOrigin = true;

		loader.load(creamUrl, (gltf) => {

			this.cream = gltf;
			this._mounted &&
				this.setState({
					creamLoaded: true,
				});

			if (
				this.state.creamLoaded &&
				this.state.lashesLoaded &&
				this.state.matteLoaded
			) {
				this._mounted &&
					this.setState({
						modelsLoaded: true,
					});
			}
		});

		loader.load(lashesUrl, (gltf) => {

			this.lashes = gltf;
			this._mounted &&
				this.setState({
					lashesLoaded: true,
				});

			if (
				this.state.creamLoaded &&
				this.state.lashesLoaded &&
				this.state.matteLoaded
			) {
				this._mounted &&
					this.setState({
						modelsLoaded: true,
					});
			}
		});

		loader.load(matteUrl, (gltf) => {

			this.matte = gltf;
			this._mounted &&
				this.setState({
					matteLoaded: true,
				});

			if (
				this.state.creamLoaded &&
				this.state.lashesLoaded &&
				this.state.matteLoaded
			) {
				this._mounted &&
					this.setState({
						modelsLoaded: true,
					});
			}
		});
	}

	componentWillUnmount() {
		this._mounted = false;
		// if (window.constructionCount >1) return;

		window.animatedGlbsConstructed = false;
	}
	render() {
		var desktopScaleMultiplier = 1.5;
		var innerScale = isMobileDevice()
			? [1, 1, 1]
			: [
					1 * desktopScaleMultiplier,
					1 * desktopScaleMultiplier,
					1 * desktopScaleMultiplier,
			  ];
		// if (this.myCount > 1) return(<div></div>);
		if (!this.state.modelsLoaded) return <div></div>;
		else if (!objsPosConfig.hasOwnProperty(this.props.scene)) {
			return <div></div>;
		} else
			return (
				<>
					{
						<GLBObj
							gltf={this.cream}
							canTween={this.state.canTween}
							setCanTween={this.setCanTween}
							canClick={this.state.canClick}
							setCanClick={this.setCanClick}
							{...this.props}
							animationCount={3}
							type="cream"
							sceneModalVisible={this.state.sceneModalVisible}
							setSceneModalVisible={this.setSceneModalVisible}
							id={0}
							pos={objsPosConfig[this.props.scene].cream}
							rotation={[0, 0, 0]}
							scene={null}
							renderer={null}
							camera={null}
							collect={this.props.collect}
							// outerObjScale={[20, 20, 20]}
							outerObjScale={[1, 2, 1]}
							innerObjScale={innerScale}
							url={
								'https://cdn.obsess-vr.com/charlotte-tilbury/MagicCream_anim_v004.glb'
							}
						/>
					}

					{
						<GLBObj
							gltf={this.lashes}
							canClick={this.state.canClick}
							setCanClick={this.setCanClick}
							canTween={this.state.canTween}
							setCanTween={this.setCanTween}
							{...this.props}
							animationCount={2}
							type="lashes"
							sceneModalVisible={this.state.sceneModalVisible}
							setSceneModalVisible={this.setSceneModalVisible}
							id={1}
							pos={objsPosConfig[this.props.scene].lashes}
							// rotation={[0,1.4,0]}
							rotation={[0, 0, 0]}
							scene={null}
							renderer={null}
							camera={null}
							collect={this.props.collect}
							// outerObjScale={[60, 22, 60]}
							outerObjScale={[1.5, 3, 1]}
							innerObjScale={innerScale}
							url={
								'https://cdn.obsess-vr.com/charlotte-tilbury/PushUpLashes_anim_v006.glb'
							}
						/>
					}

					{
						<GLBObj
							gltf={this.matte}
							canTween={this.state.canTween}
							setCanTween={this.setCanTween}
							canClick={this.state.canClick}
							setCanClick={this.setCanClick}
							{...this.props}
							animationCount={3}
							type="matte"
							sceneModalVisible={this.state.sceneModalVisible}
							setSceneModalVisible={this.setSceneModalVisible}
							id={2}
							pos={objsPosConfig[this.props.scene].matte}
							rotation={[0, 0, 0]}
							scene={null}
							renderer={null}
							camera={null}
							collect={this.props.collect}
							// outerObjScale={[30, 40, 30]}
							outerObjScale={[1, 2, 1]}
							innerObjScale={innerScale}
							url={
								'https://cdn.obsess-vr.com/charlotte-tilbury/MatteRevolution_anim_v004.glb'
							}
						/>
					}
				</>
			);
	}
}

export default AnimatedGLBs;
