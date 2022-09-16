import React, { Component } from 'react';
import * as THREE from 'three';

import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import SceneModal from './SceneModal.jsx';

const lashesUrl =
	'https://cdn.obsess-vr.com/charlotte-tilbury/PushUpLashes_anim_v006.glb';
const creamUrl =
	'https://cdn.obsess-vr.com/charlotte-tilbury/MagicCream_anim_v009.glb';
const matteUrl =
	'https://cdn.obsess-vr.com/charlotte-tilbury/MatteRevolution_anim_v004.glb';

const TWEEN = require('@tweenjs/tween.js');

const CUSTOM_OBJ = true;
// const CUSTOM_OBJ = false;

const updateCastingObjs = function (scene) {
	scene.children.forEach((i) => {
		if (
			i.position.x != 0 &&
			i.position.y != 0 &&
			i.position.z != 0 &&
			i.type != 'PerspectiveCamera'
		) {
			if (window.rayCastingCheckingObjs) {
				if (!window.rayCastingCheckingObjs.includes(i))
					window.rayCastingCheckingObjs.push(i);
			} else window.rayCastingCheckingObjs = [i];
		}
	});
};
const createCube = function (x, y) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	cube.scale.set(1, 1, 1);
	cube.position.set(x, y, 5);
	return cube;
};

import { GUI } from 'dat.gui';
const createDatGui = function (obj, folderName) {
	if (!window.DATGUI_DEFINED) {
		var guiDiv = document.createElement('div');
		guiDiv.style.zIndex = 99;
		guiDiv.style.position = 'fixed';
		guiDiv.style.top = '0px';
		var bod = document.getElementsByTagName('body')[0];
		bod.appendChild(guiDiv);

		const gui = new GUI({ autoPlace: false });
		window.gui = gui;
		// gui.close();
		// var cont = document.getElementById('datgui');
		guiDiv.appendChild(gui.domElement);
		window.DATGUI_DEFINED = true;
	}
	const folder = gui.addFolder(folderName);

	// const folder1 = gui.addFolder('folder1');

	// folder1.add(obj.material.uniforms.lacunarity, 'value').name('lacunarity x').min(0).max(10).step(0.001);
	// folder1.add(obj.material.uniforms.gain, 'value').name('gain y').min(0).max(10).step(0.001);
	// folder1.add(obj.material.uniforms.magnitude, 'value').name('magnitude z').min(0).max(10).step(0.001);

	folder.add(obj.rotation, 'x').name('rotation x').min(-7).max(7).step(0.001);
	folder.add(obj.rotation, 'y').name('rotation y').min(-7).max(7).step(0.001);
	folder.add(obj.rotation, 'z').name('rotation z').min(-7).max(7).step(0.001);

	folder.add(obj.scale, 'x').name('scale x').min(-70).max(70).step(0.001);
	folder.add(obj.scale, 'y').name('scale y').min(-70).max(70).step(0.001);
	folder.add(obj.scale, 'z').name('scale z').min(-70).max(70).step(0.001);

	folder
		.add(obj.position, 'x')
		.name('position x')
		.min(-70)
		.max(70)
		.step(0.001);
	folder
		.add(obj.position, 'y')
		.name('position y')
		.min(-70)
		.max(70)
		.step(0.001);
	folder
		.add(obj.position, 'z')
		.name('position z')
		.min(-70)
		.max(70)
		.step(0.001);
};

class GLBObj extends Component {
	setLastEvent = (e) => {
		if (!this.props.canTween) return;
		this.lastEvent = e;
	};

	handleTouchEnd = (e) => {
		if (!this.props.canTween) return;
		this.handleClickingLogic(e);
	};

	handleWindowClick = (e) => {
		if (!this.props.canTween) return;
		this.lastEvent = e;
		this.handleClickingLogic(e);
	};

	handleMouseMove = (e) => {
		var hit = this.getRaycastIntersects(e);
		if (hit && hit.length > 0) {
			this.renderer.domElement.style.cursor = 'pointer';
		} else {
			this.renderer.domElement.style.cursor = 'default';
		}
	};

	constructor(props) {
		super(props);
		this.val = Math.random();
		this.loadModel = this.loadModel.bind(this);
		this.animate = this.animate.bind(this);
		this.handleClickingLogic = this.handleClickingLogic.bind(this);
		this.setVis = this.setVis.bind(this);
		this.setTransparency = this.setTransparency.bind(this);
		this.getRaycastIntersects = this.getRaycastIntersects.bind(this);

		this.state = {
			modalVisible: false,
			blurRadius: 1,
		};
		window.addEventListener('click', this.handleWindowClick);
		window.addEventListener('touchstart', this.setLastEvent);
		window.addEventListener('touchmove', this.setLastEvent);
		window.addEventListener('touchend', this.handleTouchEnd);
		document.addEventListener('mousemove', this.handleMouseMove, false);
	}

	handleClickingLogic(e) {
		var hit = this.getRaycastIntersects(e);
		if (
			hit &&
			hit.length &&
			!this.state.modalVisible &&
			!this.props.sceneModalVisible
		) {
			var point = hit[0].point;
			var id = hit[0].object.userData.id;
			if (id != this.props.id) return;
			if (!this.props.canClick) return;
			this.props.setCanClick(false);
			this.props.collect({
				eventCategory: 'Intrepidations',
				eventAction: this.props.type,
				eventLabel: 'Pick me up! Take me for a spin!',
			});
			var camDistance = this.camera.position.length();
			var originalPos = this.camera.position.clone();
			var targetPos = new THREE.Vector3(point.x, point.y, point.z);
			targetPos.normalize().multiplyScalar(-camDistance);
			this.tweenAnimFrame = requestAnimationFrame(this.animate);
			// this.animate();
			new TWEEN.Tween(originalPos)
				.to(
					{
						x: targetPos.x,
						y: targetPos.y,
						z: targetPos.z,
					},
					1200,
				)
				//.delay (1000)
				.easing(TWEEN.Easing.Cubic.Out)
				.onUpdate(() => {
					this.camera.position.x = originalPos.x;
					this.camera.position.y = originalPos.y;
					this.camera.position.z = originalPos.z;
				})
				.start()
				.onComplete((scope) => {
					// cancelAnimationFrame(this.tweenAnimFrame);

					var id = hit[0].object.userData.id;
					if (this.props.id == id) {
						var x = { radius: 1 };
						new TWEEN.Tween(x)
							.to({ radius: 10 }, 500)
							.onUpdate(() => {
								this._mounted &&
									this.setState({
										blurRadius: x.radius,
									});
							})
							.start()
							.onComplete(() => {
								this.props.setCanTween(false);
							});

						if (id == 0) {
							window.aa = true;
						}
						if (id == 1) {
							window.bb = true;
						}
						if (id == 2) {
							window.cc = true;
						}
						this.props.setSceneModalVisible(true);
					}
					that.forEach((i) => i.initAnimationConditions());
				}, this);
			// this.camera.position.copy(point).normalize().multiplyScalar(-camDistance);
		}
	}
	setTransparency(obj) {
		obj.traverse((o) => {
			if (o.material) {
				o.material.transparent = true;
				o.material.opacity = 0.5;
			}
		});
	}

	loadModel(url, scene) {
		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath(
			'https://cdn.obsess-vr.com/charlotte-tilbury/gltf/',
		);
		loader.setDRACOLoader(dracoLoader);
		loader.crossOrigin = true;
		loader.load(url, (gltf) => {
			this.obj = gltf.scene;
			this.setTransparency(this.obj);
			if (!window.outerObjs) window.outerObjs = [this.obj];
			else window.outerObjs.push(this.obj);

			gltf.scene.traverse((o) => {
				// this.rayCastingCheckingOjbs.push(o);
				o.userData.id = this.props.id;
			});

			this.obj.position.set(...this.props.pos);
			// this.obj.rotation.x = .5;
			// this.obj.rotation.y = 4.488;
			this.obj.scale.set(...this.props.rotation);
			this.obj.scale.set(...this.props.outerObjScale);
			scene.add(this.obj);
			// createDatGui(this.obj,Math.random());
			window.o = this.obj;
			this.animate();

			gltf.scene.traverse((o) => {
				o.material && (o.material.envMapIntensity = 1.81);

				if (window.rayCastingCheckingObjs) {
					window.rayCastingCheckingObjs.push(o);
				} else {
					window.rayCastingCheckingObjs = [o];
				}
			});
		});
	}

	getRaycastIntersects(e) {
		// if (this.lastEvent && this.lastEvent.hasOwnProperty('touches') && this.lastEvent?.touches.length > 0){
		if (e.touches) {
			// var x = this.lastEvent?.touches[0].pageX;
			// var y = this.lastEvent?.touches[0].pageY;
			var x = this.lastEvent?.touches[0].pageX;
			var y = this.lastEvent?.touches[0].pageY;
		} else {
			var x = e.clientX;
			var y = e.clientY;
		}
		// var x = (this.lastEvent?.touches && this.lastEvent?.touches.length > 0) ? this.lastEvent?.touches[0].clientX : this.lastEvent?.clientX
		// var y = (this.lastEvent?.touches && this.lastEvent?.touches.length > 0) ? this.lastEvent?.touches[0].clientY : this.lastEvent?.clientY
		this.raycaster.setFromCamera(
			{
				x: (x / window.innerWidth) * 2 - 1,
				y: -(y / window.innerHeight) * 2 + 1,
			},
			this.camera,
		);
		if (window?.rayCastingCheckingObjs) {
			return this.raycaster.intersectObjects(
				window.rayCastingCheckingObjs.concat(
					this.props.sceneRef.current.children.filter((i) => i.type == 'Sprite'),
				),
			);
		}
		return [];
	}

	animate() {
		this.props.canTween && requestAnimationFrame(this.animate);
		TWEEN.update();
		// this.obj.rotation.y+=.01;
	}

	componentDidMount() {
		this._mounted = true;

		this.scene = this.props.scene || this.props.sceneRef.current;
		this.camera = this.props?.camera || window.c.object;
		this.controls = this.props?.controlers || window.c;
		this.renderer = this.props.renderer || window['containerInstance_renderer'];

		if (CUSTOM_OBJ) {
			const light = new THREE.DirectionalLight(0xffffff, 0.8);
			// this.scene.add(light);
			// this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
			this.obj = createCube(3 * Math.random(), 3 * Math.random());
			this.scene.add(this.obj);
			this.obj.position.set(...this.props.pos);
			this.obj.scale.set(...this.props.outerObjScale);
			this.obj.material.transparent = true;

			this.obj.material.opacity = 0;

			this.obj.userData.id = this.props.id;
			// createDatGui(this.obj,Math.random())
			if (window.rayCastingCheckingObjs) {
				window.rayCastingCheckingObjs.push(this.obj);
			} else {
				window.rayCastingCheckingObjs = [this.obj];
			}
		}

		// this.renderer.physicallyCorrectLights = true
		// this.renderer.outputEncoding = THREE.sRGBEncoding;

		if (!CUSTOM_OBJ) {
			this.loadModel(this.props.url, this.scene);
			// this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
		}

		this.raycaster = new THREE.Raycaster();

		updateCastingObjs(this.props.sceneRef.current);
	}

	setVis(val) {
		this._mounted && this.setState({ modalVisible: val });
	}

	componentWillUnmount() {
		this._mounted = false;
		window.rayCastingCheckingObjs = [];
		this.scene.remove(this.obj);
		document.removeEventListener('mousemove', this.handleMouseMove);

		window.removeEventListener('click', this.handleWindowClick);
		window.removeEventListener('touchstart', this.setLastEvent);
		window.removeEventListener('touchmove', this.setLastEvent);
		window.removeEventListener('touchend', this.handleTouchEnd);
	}

	componentWillUpdate() {
	}

	render() {
		const typeUrlMap = {
			lashes: lashesUrl,
			cream: creamUrl,
			matte: matteUrl,
		};
		var scale =
			this.props.type == 'matte'
				? [
						this.props.innerObjScale[0] * 1.5,
						this.props.innerObjScale[1] * 1.5,
						this.props.innerObjScale[2] * 1.5,
				  ]
				: this.props.innerObjScale;
		return (
			<div>
				<SceneModal
					gltf={this.props.gltf}
					setCanTween={this.props.setCanTween}
					canTween={this.props.canTween}
					setCanClick={this.props.setCanClick}
					animationCount={this.props.animationCount}
					type={this.props.type}
					setSceneModalVisible={this.props.setSceneModalVisible}
					sceneModalVisible={this.props.sceneModalVisible}
					id={this.props.id}
					url={typeUrlMap[this.props.type]}
					scale={scale}
					blurRadius={this.state.blurRadius}
					setVis={this.setVis}
					modalVisible={this.state.modalVisible}
				/>
			</div>
		);
	}
}

export default GLBObj;
