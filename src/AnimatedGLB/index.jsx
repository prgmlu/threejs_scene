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

// const CUSTOM_OBJ = true;
const CUSTOM_OBJ = false;

const objsPosConfig = {
	//disco-game
	// 6242242a42f102f9875fa895
	'6242242a42f102f9875fa895' : {
		cream: [5, -1, -0.1],
		lashes: [-0.5, .6, 5],
		matte: [-1.3, -0.9, -5],
	},

	//disco-bts
	// 624221a9daa2aa92c9fd575f
	'624221a9daa2aa92c9fd575f' : {
		cream: [-1.2, -1.2, 5],
		lashes: [-1, .6, -5],
		matte: [5, -0.9, 0],
	},

	//disco-masterclass
	// 623b5325b452e0eb474fd84f
	'623b5325b452e0eb474fd84f' : {
		cream: [-1.441, -1.1, -5],
		lashes: [5, 0.4, -0.3],
		matte: [-0.901, -0.9, 5],
	}

}

const createCube = function (x, y) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	cube.scale.set(1, 1, 1);
	cube.position.set(x, y, 5);
	return cube;
};


class AnimatedGLBs extends Component {
	constructor(props) {
		super(props);
		if (window.animatedGlbsConstructed) {
			window.constructionCount+=1;
			this.myCount = window.constructionCount;

			if(window.constructionCount > 1)
				return

		}else{
			window.animatedGlbsConstructed = true;
			window.constructionCount = 1;
			this.myCount = 1;
		}


		// alert('cons')

		// alert(props.roomId)

		this.setEnvMap(props.sceneRef.current);

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
		if(!window.rotationAnim){
			window.rotationAnim = true;
			// this.animate();
		}
	}

	// shouldComponentUpdate(){
		// return false;
	// }


	setEnvMap(scene){
		var rgbeLoader = new RGBELoader();
		rgbeLoader.load(
			'https://cdn.obsess-vr.com/charlotte-tilbury/Footprint_Court_Env_v002.hdr',
			(texture) => {
				const generator = new THREE.PMREMGenerator(
					window.renderer,
				);
				generator.compileEquirectangularShader();
				var envMap = generator.fromEquirectangular(texture).texture;
				scene.environment = envMap;
			},
		);
	}


	componentWillUpdate(nextProps, nextState) {
		if (window.constructionCount >1) return;
		this.setEnvMap(nextProps.sceneRef.current);
	}

	animate(){
		requestAnimationFrame(this.animate);
		if (window.outerObjs){
			for(var i=0; i<window.outerObjs.length; i++){
				window.outerObjs[i].rotation.y+=.01;
			}
		}
	}

	setSceneModalVisible(val) {
		this.setState({
			sceneModalVisible: val,
		});
	}
	setCanTween(val) {
		this.setState({
			canTween: val,
		});
	}
	setCanClick(val) {
		this.setState({
			canClick: val,
		});
	}

	componentWillUnmount(){
		// if (window.constructionCount >1) return;
		// alert('unmountin')

		window.animatedGlbsConstructed = false;
	}
	render() {
		if (this.myCount > 1) return(<div></div>);
		else if(! objsPosConfig.hasOwnProperty(this.props.scene)) { return (<div></div>)}
		else return (
			<>
				{
					<GLBObj
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
						
						rotation={[0,0,0]}
						scene={null}
						renderer={null}
						camera={null}
						scale={[20, 20, 20]}
						url={
							'https://cdn.obsess-vr.com/charlotte-tilbury/MagicCream_anim_v004.glb'
						}
						/>
					}

				{
					<GLBObj
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
						rotation={[0,0,0]}
						scene={null}
						renderer={null}
						camera={null}
						scale={[60, 22, 60]}
						// scale={[22, 22, 22]}
						url={
							'https://cdn.obsess-vr.com/charlotte-tilbury/PushUpLashes_anim_v006.glb'
						}
					/>
				}

				{
					<GLBObj
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
						rotation={[0,0,0]}
						scene={null}
						renderer={null}
						camera={null}
						scale={[30, 40, 30]}
						// scale={[22, 22, 22]}
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
