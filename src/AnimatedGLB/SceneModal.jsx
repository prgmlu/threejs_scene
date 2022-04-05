import React, { Component } from 'react';
// import GLBObj from './GLBObj.jsx';

// import React, { Component } from 'react';

import * as THREE from 'three';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';

import { RGBELoader } from '../../node_modules/three/examples/jsm/loaders/RGBELoader.js';

const TEXTS_MAP = {
	cream: [
		'Tap to unbox me, darling!',
		'Open me up, darling!',
		'Now, let me show you how I refill!',
	],
	lashes: [
		'Tap to unbox me, darling!',
		'Open up! Let me show you my fabulous wand!',
	],
	matte: [
		'Tap to unbox me, darling!',
		'Uncap me!',
		'Tap me to twist me, darling!',
	],
};

const ANIMATION_SPEED = 1;
const OPACITY_TRANS_RATE = 4;
const MIN_FOV = 50;
const MAX_FOV = 70;

const createRenderer = function () {
	window.modalRenderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true,
		// preserveDrawingBuffer: true,
	});
	window.modalRenderer.physicallyCorrectLights = true;
	window.modalRenderer.outputEncoding = THREE.sRGBEncoding;

	window.modalRenderer.setPixelRatio(window.devicePixelRatio);
	window.modalRenderer.setSize(window.innerWidth, window.innerHeight);
	window.modalRenderer.setClearColor(0xffcaca, 0);
	window.modalRenderer.domElement.style.touchAction = 'none';
};

function handleOpacitiesByAnimation(
	animationNumber,
	progressRatio,
	box,
	outerPart_0,
	outerPart_1,
	innerPart_0,
	innerPart_1,
	boxParent,
	type,
	that,
) {
	// if (!innerPart_0 || !innerPart_1 || !outerPart_0 || !outerPart_1) return;
	that.setTextOpacity(progressRatio);
	// console.log(progressRatio);
	//finite state machine
	if (type == 'cream') {
		if (animationNumber == 1) {
			box.material.transparent = false;
			box.material.opacity = 1;

			innerPart_0.material.transparent = false;
			innerPart_0.material.opacity = 1;

			innerPart_1.material.transparent = true;
			innerPart_1.material.opacity = 0.35;

			outerPart_0.material.transparent = true;
			outerPart_0.material.opacity = 0;

			outerPart_1.material.transparent = true;
			outerPart_1.material.opacity = 0;
		}

		if (animationNumber == 2) {
			if (progressRatio < 0.98 / OPACITY_TRANS_RATE) {
				box.material.transparent = true;
				box.material.opacity = Math.max(
					0,
					1 - OPACITY_TRANS_RATE * progressRatio,
				);
			} else {
				// box.material.transparent = true;
				// box.material.opacity = 0;

				boxParent.remove(box);

				innerPart_0.material.transparent = false;
				innerPart_0.material.opacity = 1;

				innerPart_1.material.transparent = true;
				innerPart_1.material.opacity = 0.35;

				outerPart_0.material.transparent = true;
				outerPart_0.material.opacity = 0;

				outerPart_1.material.transparent = true;
				outerPart_1.material.opacity = 0;
			}
		}

		if (animationNumber == 3) {
			that.outerPart_0Parent.add(that.outerPart_0);
			that.outerPart_1Parent.add(that.outerPart_1);
			if (progressRatio < 0.98 / OPACITY_TRANS_RATE) {
				innerPart_0.material.transparent = true;
				innerPart_0.material.opacity =
					1 - OPACITY_TRANS_RATE * progressRatio;

				innerPart_1.material.transparent = true;
				innerPart_1.material.opacity =
					0.35 * (1 - OPACITY_TRANS_RATE * progressRatio);

				outerPart_0.material.transparent = true;
				// outerPart_0.material.opacity = 1;
				outerPart_0.material.opacity =
					OPACITY_TRANS_RATE * progressRatio;

				outerPart_1.material.transparent = true;
				// outerPart_1.material.opacity = 1;
				outerPart_1.material.opacity =
					OPACITY_TRANS_RATE * progressRatio;
			} else {
				box.material.transparent = true;
				box.material.opacity = 0;

				innerPart_0.material.transparent = true;
				innerPart_0.material.opacity = 0;

				innerPart_1.material.transparent = true;
				innerPart_1.material.opacity = 0;

				outerPart_0.material.transparent = false;
				outerPart_0.material.opacity = 1;

				outerPart_1.material.transparent = false;
				outerPart_1.material.opacity = 1;
			}
		}
	}
	if (type == 'lashes') {
		if (animationNumber == 2) {
			if (progressRatio < 0.98) {
				box.material.transparent = true;
				box.material.opacity = Math.max(
					0,
					1 - OPACITY_TRANS_RATE * progressRatio,
				);
			} else {
				box.material.transparent = true;
				box.material.opacity = 0;
			}
		}
	}

	if (type == 'matte') {
		if (animationNumber == 2) {
			if (progressRatio < 0.98) {
				box.material.transparent = true;
				box.material.opacity = Math.max(
					0,
					1 - OPACITY_TRANS_RATE * progressRatio,
				);
			} else {
				box.material.transparent = true;
				box.material.opacity = 0;
			}
		}
	}
}

class SceneModal extends Component {
	initAnimationConditions() {
		// if(this.animationPlaying && this.props.sceneModalVisible) return;

		// this.obj.traverse((o)=>{
		//     o.position.set(this.positionMap[o.name].clone().x,this.positionMap[o.name].clone().y,this.positionMap[o.name].clone().z);
		// })

		this.setTextOpacity(0);
		this.obj.position.z = -0.3;

		this.camera.fov = MAX_FOV;
		this.camera.updateProjectionMatrix();

		this.obj.rotation.y = 0;

		if (this.props.type == 'cream') {
			this.obj.rotation.y = Math.PI / 2;
		}

		this.currentAnimationCounter = 0;
		this._mounted && this.setState({ animationCounter: 0 });
		this.animationPlaying = false;
		for (var i = 0; i < this.animationClips.length; i++) {
			this.mixer.clipAction(this.animationClips[i]).reset();
			this.mixer.clipAction(this.animationClips[i]).paused = true;
		}

		if (this.props.type == 'lashes') {
			this.box.material.opacity = 1;
			this.box.material.transparent = false;
		}

		if (this.props.type == 'matte') {
			this.box.material.opacity = 1;
			this.box.material.transparent = false;
		}

		if (this.props.type == 'cream') {
			this.box.material.opacity = 1;
			this.box.material.transparent = false;

			this.boxParent.add(this.box);

			if (
				this.innerPart_0 &&
				this.innerPart_1 &&
				this.outerPart_0 &&
				this.outerPart_1 &&
				this.box
			) {
				this.outerPart_0Parent.remove(this.outerPart_0);
				this.outerPart_1Parent.remove(this.outerPart_1);

				this.outerPart_0.material.transparent = true;
				this.outerPart_1.material.transparent = true;

				this.outerPart_0.material.opacity = 0;
				this.outerPart_1.material.opacity = 0;

				this.box.material.transparent = false;
				this.box.material.opacity = 1;

				this.innerPart_0.material.transparent = false;

				this.innerPart_1.material.transparent = true;
				this.innerPart_1.opacity = 0.35;
			}
		}
		window.modalRenderer.clear();
		// window.modalRenderer.render(this.scene, this.camera);
		// this.setText(this.currentAnimationCounter);
	}

	constructor(props) {
		if (window.glbCounter) {
			window.glbCounter += 1;
		} else {
			window.glbCounter = 1;
		}
		super(props);

		this._touchZoomDistanceStart = 0;
		this._touchZoomDistanceEnd = 0;

		this.clock = new THREE.Clock();
		this.clock.start();
		this.positionMap = {};

		this.currentAction = {};
		this.currentAction.paused = true;

		this.myRef = React.createRef();
		this.state = {
			animationCounter: 0,
			visible: false,
			width: window.innerWidth,
			height: window.innerHeight,
			// top: window.innerHeight / 2 / 2,
			// left: window.innerWidth / 2 / 2,
			top: 0,
			left: 0,
		};

		this.animationClips = [];
		window.animationClips = this.animationClips;
		if (window.that) {
			window.that.push(this);
		} else {
			window.that = [this];
		}
		this.currentAnimationCounter = 0;

		this.lastMPos = {
			x: 0,
			y: 0,
		};
		this.animationPlaying = false;
		this.animate = this.animate.bind(this);
		this.setZoom = this.setZoom.bind(this);
		this.setText = this.setText.bind(this);
		this.setTextOpacity = this.setTextOpacity.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.loadModel = this.loadModel.bind(this);
		this.sizingLogic = this.sizingLogic.bind(this);
		this.initAnimationConditions = this.initAnimationConditions.bind(this);
		this.getRaycastIntersects = this.getRaycastIntersects.bind(this);
		this.playNextAction = this.playNextAction.bind(this);
		this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
		this.rotateObject = this.rotateObject.bind(this);
	}

	handleRendererMouseMove = (e) => {
		// e.stopPropagation();
		this.rotateObject(e);
		// var hit = this.getRaycastIntersects(e);
		// if (hit && hit.length > 0) {
		// 	document.body.style.cursor = 'pointer';
		// } else {
		// 	document.body.style.cursor = 'default';
		// }
	};

	handleMouseDown = () => {
		this.canRotate = true;
		this.first = true;
	};

	handleTouchStart = (e) => {
		this.canRotate = true;
		this.first = true;

		if (e.touches.length == 2) {
			// console.log('2');
			var dx = e.touches[0].pageX - e.touches[1].pageX;
			var dy = e.touches[0].pageY - e.touches[1].pageY;
			this._touchZoomDistanceEnd = this._touchZoomDistanceStart =
				Math.sqrt(dx * dx + dy * dy);
		}
	};

	handleMouseUp = () => {
		this.canRotate = false;
	};

	handleDocumentClick = (e) => {
		// var hit = this.getRaycastIntersects(e);

		// if (hit.length > 0) {
		this.playNextAction();
		// }
	};

	handleResize = () => {
		var blur = document.getElementById('blur');

		window.modalRenderer.setSize(window.innerWidth, window.innerHeight);

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		// window.modalRenderer.setSize(window.innerHeight/2);

		this._mounted &&
			this.setState({
				width: window.innerWidth,
				height: window.innerHeight,
				top: 0,
				left: 0,
			});
	};

	mouseWheelHandler = (e) => {
		const fovDelta = e.deltaY;
		const temp = this.camera.fov + Math.round(fovDelta * 0.04);

		this.setZoom(temp);

		// if (temp >= MIN_FOV && temp <= MAX_FOV) {
		// 	this.camera.fov = temp; // eslint-disable-line
		// 	this.camera.updateProjectionMatrix();
		// }
	};

	handleTouchMove(e) {
		this.rotateObject(e);

		if (e.touches.length == 2) {
			var dx = e.touches[0].pageX - e.touches[1].pageX;
			var dy = e.touches[0].pageY - e.touches[1].pageY;
			this._touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

			var factor =
				this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
			this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
			this.setZoom(this.camera.fov * factor);
		}
	}

	playNextAction() {
		// console.log(this.currentAnimationCounter);
		if (this.animationPlaying) {
			// var action = this.mixer.clipAction(this.animationClips[this.currentAnimationCounter]);
			// this.currentAction.paused = true;
			return;
		}
		if (this.currentAnimationCounter >= this.animationClips.length) return;
		this.setText(this.currentAnimationCounter);
		this.currentAction = this.mixer.clipAction(
			this.animationClips[this.currentAnimationCounter],
		);
		window.currentAction = this.currentAction;
		this.currentAction.loop = THREE.LoopOnce;
		this.currentAction.clampWhenFinished = true;
		this.currentAction.play();
		this.currentAction.paused = false;
		this.animationPlaying = true;
		this.currentAnimationCounter += 1;
		this._mounted &&
			this.setState({
				animationCounter: this.state.animationCounter + 1,
			});
	}

	animate() {
		// console.log(this.scene.uuid);
		if (
			(window.aa && this.props.id == 0) ||
			(window.bb && this.props.id == 1) ||
			(window.cc && this.props.id == 2)
		) {
			window.modalAnim = requestAnimationFrame(this.animate);
		}

		// this.controls.update();
		if (this.mixer) {
			this.mixer.update(ANIMATION_SPEED * this.clock.getDelta());
			if (
				this.mixer &&
				this.mixer._actions &&
				this.mixer._actions.length == this.props.animationCount &&
				this.currentAnimationCounter != 0
			) {
				var progressRatio =
					this.mixer._actions[this.currentAnimationCounter - 1].time /
					this.animationClips[this.currentAnimationCounter - 1]
						.duration;
				handleOpacitiesByAnimation(
					this.currentAnimationCounter,
					progressRatio,
					this.box,
					this.outerPart_0,
					this.outerPart_1,
					this.innerPart_0,
					this.innerPart_1,
					this.boxParent,
					this.props.type,
					this,
				);
			}
		}

		window.modalRenderer.render(this.scene, this.camera);
	}

	rotateObject(e) {
		if (!this.canRotate) return;
		//you can only calculate the distance if therer already was a mouse event
		if (e.touches && e.touches.length == 1) {
			if (typeof this.lastMPos.x != 'undefined') {
				//calculate how far the mouse has moved
				var deltaX = this.lastMPos.x - e.touches[0].clientX;
				var deltaY = this.lastMPos.y - e.touches[0].clientY;

				// var ex = deltaX/deltaY *.01;
				// if (ex && ex!=Infinity && ex!=-Infinity){
				//     this.obj.rotation.z -=  ex;
				// }

				if (this.first) {
					deltaX = 0;
					deltaY = 0;
				}
				this.first = false;

				//rotate your object accordingly
				this.obj.rotation.x -= deltaY * 0.03;
				this.obj.rotation.y -= deltaX * 0.03;
			}

			//save current mouse Position for next time
			this.lastMPos = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY,
			};
		} else {
			if (typeof this.lastMPos.x != 'undefined') {
				//calculate how far the mouse has moved
				var deltaX = this.lastMPos.x - e.clientX,
					deltaY = this.lastMPos.y - e.clientY;

				if (this.first) {
					deltaX = 0;
					deltaY = 0;
				}
				this.first = false;

				//rotate your object accordingly
				this.obj.rotation.x -= deltaY * 0.01;
				this.obj.rotation.y -= deltaX * 0.01;
				// var ex = deltaX/deltaY *.01;
				// if (ex && ex!=Infinity && ex!=-Infinity){
				//     this.obj.rotation.z -=  ex;
				// }
			}

			//save current mouse Position for next time
			this.lastMPos = {
				x: e.clientX,
				y: e.clientY,
			};
		}
	}

	sizingLogic() {
		// window.modalRenderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
		window.modalRenderer.setSize(window.innerWidth, window.innerHeight);
	}

	getRaycastIntersects(e) {
		// debugger;
		var x =
			e.touches && e.touches.length > 0
				? e.touches[0].clientX
				: e.clientX;
		var y =
			e.touches && e.touches.length > 0
				? e.touches[0].clientY
				: e.clientY;

		this.raycaster.setFromCamera(
			{
				x: (x / window.innerWidth) * 2 - 1,
				y: -(y / window.innerHeight) * 2 + 1,
			},
			this.camera,
		);

		// var hit = this.raycaster.intersectObjects(window.rayCastingCheckingObjs);
		var hit = this.raycaster.intersectObjects(this.rayCastingCheckingObjs);

		return hit;
	}

	setTextOpacity(progress) {
		var text = document.getElementById('text');
		text.style.color = `rgba(52, 12, 12,${1 - progress})`;
		if (progress == 1) {
			var textSet = this.setText(this.currentAnimationCounter + 1);
			textSet
				? (text.style.color = `rgba(52, 12, 12,1)`)
				: (text.style.color = `rgba(52, 12, 12,0)`);
		}
	}

	setText(counter) {
		// console.log(counter,this.animationClips.length )
		if (counter > this.animationClips.length) return false;
		var text = document.getElementById('text');
		if (window.aa) {
			text.innerText = TEXTS_MAP['cream'][Math.max(0, counter - 1)];
		}

		if (window.bb) {
			text.innerText = TEXTS_MAP['lashes'][Math.max(0, counter - 1)];
		}

		if (window.cc) {
			text.innerText = TEXTS_MAP['matte'][Math.max(0, counter - 1)];
		}
		return true;
	}

	componentWillUpdate(nextProps, nextState) {
		if (!this._mounted) return;
		this.setText(this.currentAnimationCounter);
		if (nextProps.sceneModalVisible && !this.props.sceneModalVisible) {
			//visibiity change from not visible to visible
			this._mounted && this.setState({ visible: true });
			window.cancelAnimationFrame(window.modalAnim);
			window.modalAnim = this.animate();

			this.setText(this.currentAnimationCounter);

			return;
		}
		if (
			!nextProps.sceneModalVisible &&
			this.state.visible != nextState.visible
		) {
			this._mounted && this.setState({ visible: false });
		}
	}

	loadModel() {
		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath(
			'https://www.gstatic.com/draco/v1/decoders/',
		);
		loader.setDRACOLoader(dracoLoader);

		loader.crossOrigin = true;
		// loader.load(this.props.url, (gltf) => {
		// debugger;
		let gltf = this.props.gltf;
		if (window.objs) {
			window.objs.push(gltf.scene);
		} else {
			window.objs = [gltf.scene];
		}
		this.obj = gltf.scene;

		this.obj.traverse((o) => {
			// this.positionMap[o.name] = o.position.clone();
			// window.positionMap = this.positionMap;

			if (this.props.type == 'cream') {
				if (o.name == 'Box_GEO') {
					this.box = o;
					this.box.material = this.box.material.clone();
					// if(this.box.material.map)
					//     this.box.material.map = this.box.material.map.clone();
					this.boxParent = this.box.parent;
					window.box = this.box;
					window.boxParent = this.boxParent;
				}
				if (o.name == 'Mesh') {
					this.outerPart_0 = o;
					this.outerPart_0.material =
						this.outerPart_0.material.clone();
					// if(this.outerPart_0.material.map)
					//     this.outerPart_0.material.map = this.outerPart_0.material.map.clone();
					window.outerPart_0 = this.outerPart_0;
					this.outerPart_0Parent = this.outerPart_0.parent;
					window.outerPart_0Parent = this.outerPart_0.parent;
				}

				if (o.name == 'Mesh_1') {
					this.outerPart_1 = o;
					this.outerPart_1.material =
						this.outerPart_1.material.clone();
					// if(this.outerPart_1.material.map)
					//     this.outerPart_1.material.map = this.outerPart_1.material.map.clone();
					window.outerPart_1 = this.outerPart_1;
					this.outerPart_1Parent = this.outerPart_1.parent;
					window.outerPart_1Parent = this.outerPart_1.parent;
				}

				if (o.name == 'Mesh_2') {
					this.innerPart_0 = o;
					this.innerPart_0.material =
						this.innerPart_0.material.clone();
					// if(this.innerPart_0.material.map)
					//     this.innerPart_0.material.map = this.innerPart_0.material.map.clone();
					window.innerPart_0 = this.innerPart_0;
				}
				if (o.name == 'Mesh_3') {
					this.innerPart_1 = o;
					this.innerPart_1.material =
						this.innerPart_1.material.clone();
					// if(this.innerPart_1.material.map)
					//     this.innerPart_1.material.map = this.innerPart_1.material.map.clone();
					window.innerPart_1 = this.innerPart_1;
				}
			}
			if (this.props.type == 'lashes') {
				if (o.name == 'Box_GEO') {
					this.box = o;
					this.box.material = this.box.material.clone();
					// if(this.box.material.map)
					//     this.box.material.map = this.box.material.map.clone();
					this.boxParent = this.box.parent;
					window.box = this.box;
					window.boxParent = this.boxParent;
				}
			}
			if (this.props.type == 'matte') {
				// debugger;
				if (o.name == 'Box_GEO') {
					this.box = o;
					this.box.material = this.box.material.clone();
					// if(this.box.material.map)
					//     this.box.material.map = this.box.material.map.clone();
					this.boxParent = this.box.parent;
					window.box = this.box;
					window.boxParent = this.boxParent;
				}
			}
		});

		this.obj.position.set(0, 0.035, -0.3);
		this.obj.rotation.x = 0.5;
		this.obj.scale.set(...this.props.scale);

		this.obj.traverse((o) => {
			this.obj.traverse((o) => {
				o.material && (o.material.envMapIntensity = 1.81);
			});
			o.userData.id = this.props.id;
		});

		this.scene.add(this.obj);
		this.mixer = new THREE.AnimationMixer(this.obj);
		window.mixer = this.mixer;
		this.mixer.addEventListener('finished', () => {
			this.animationPlaying = false;
		});

		gltf.animations.forEach((clip) => {
			this.animationClips.push(clip);
		});
		if (this.props.type == 'cream') {
			var tmp = this.animationClips[0];
			this.animationClips[0] = this.animationClips[1];
			this.animationClips[1] = tmp;
		}
		if (this.props.type == 'lashes') {
			var tmp = this.animationClips[0];
			this.animationClips[0] = this.animationClips[1];
			this.animationClips[1] = tmp;
		}

		if (this.props.type == 'matte') {
			this.animationClips = [
				this.animationClips[1],
				this.animationClips[0],
				this.animationClips[2],
			];
		}

		// this.playNextAction();
		// this.mixer.clipAction( this.animationClips[this.currentAnimationCounter] ).play();
		// this.currentAnimationCounter += 1;
		// this.mixer.clipAction( this.animationClips[this.currentAnimationCounter] ).play();
		// this.animationPlaying = true;

		// const controls = new DragControls( [data.scene], this.camera, window.modalRenderer.domElement );
		// }

		// );
	}

	componentDidMount() {
		this._mounted = true;
		this.rayCastingCheckingObjs = [];

		this.raycaster = new THREE.Raycaster();
		this.mouseDownEventListener = document.addEventListener(
			'mousedown',
			this.handleMouseDown,
			true,
		);

		this.touchStartEventListener = document.addEventListener(
			'touchstart',
			this.handleTouchStart,
			true,
		);

		this.mouseUpEventListener = document.addEventListener(
			'mouseup',
			this.handleMouseUp,
			true,
		);

		this.resizeEventListener = window.addEventListener(
			'resize',
			this.handleResize,
		);

		this.documentClickEventListener = document.addEventListener(
			'click',
			this.handleDocumentClick,
		);

		if (!window.modalRenderer) {
			createRenderer();
		}
		this.rendererWheelListener =
			window.modalRenderer.domElement.addEventListener(
				'wheel',
				this.mouseWheelHandler,
				{ passive: true },
			);

		this.myRef.current.appendChild(window.modalRenderer.domElement);

		this.rendererTouchMoveListener =
			window.modalRenderer.domElement.addEventListener(
				'touchmove',
				this.handleTouchMove,
				false,
			);
		this.rendererMouseMoveListener =
			window.modalRenderer.domElement.addEventListener(
				'mousemove',
				this.handleRendererMouseMove,
				true,
			);

		// if(!this.scene){
		this.scene = new THREE.Scene();
		// }

		this.camera = new THREE.PerspectiveCamera(
			MAX_FOV,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);

		window.cam = this.camera;

		// this.camera.

		// var texLoader = new THREE.TextureLoader();
		// texLoader.load('https://discourse-cloud-file-uploads.s3.dualstack.us-west-2.amazonaws.com/standard17/uploads/threejs/original/2X/3/30fb8c956c8f9363c883bb63dfc4889f0406f6a8.jpg',
		// (tex)=>{
		//     this.scene.envMap = tex;
		// })

		this.ambLight = new THREE.AmbientLight(0xffffff, 0.093);
		this.scene.add(this.ambLight);

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.23);
		this.directionalLight.position.x = 5;
		this.directionalLight.position.y = -4.514;
		this.directionalLight.position.z = 5;

		this.scene.add(this.directionalLight);

		var rgbeLoader = new RGBELoader();
		// rgbeLoader.setDataType(THREE.UnsignedByteType);
		rgbeLoader.load(
			'https://cdn.obsess-vr.com/charlotte-tilbury/Footprint_Court_Env_v002.hdr',
			(texture) => {
				texture.rotation += 2;

				const generator = new THREE.PMREMGenerator(
					window.modalRenderer,
				);
				generator.compileEquirectangularShader();

				var envMap = generator.fromEquirectangular(texture).texture;

				window.ev = envMap;

				this.scene.environment = envMap;

				var texLoader = new THREE.TextureLoader();

				// this.scene.background = envMap;

				// this.scene.background = envMap;
			},
		);

		// var tl = new THREE.TextureLoader();
		// tl.load(light, (t)=>{
		//     this.scene.background=t;
		// })

		const lightR = new THREE.SpotLight(0xffffff, 0.8);
		lightR.position.set(-1, 0, 0);
		// this.scene.add(lightR);

		this.loadModel();

		// this.animate();
	}

	componentWillUnmount() {
		this._mounted = false;
		// alert('modal unmounts')
		// this.scene.remove(this.obj);
		// this.obj.traverse((o) => {
		// 	if (o.dispose) o.dispose();
		// })
		// this.scene.remove(this.ambLight);
		// this.scene.remove(this.directionalLight);

		document.removeEventListener('mousedown', this.handleMouseDown);

		document.removeEventListener('touchstart', this.handleTouchStart);

		document.removeEventListener('mouseup', this.handleMouseUp);

		window.removeEventListener('resize', this.handleResize);

		document.removeEventListener('click', this.handleDocumentClick);

		window.modalRenderer.domElement.removeEventListener(
			'wheel',
			this.mouseWheelHandler,
		);

		window.modalRenderer.domElement.removeEventListener(
			'touchmove',
			this.handleTouchMove,
		);

		window.modalRenderer.domElement.removeEventListener(
			'mousemove',
			this.handleRendererMouseMove,
		);
	}

	setZoom(fov) {
		this.camera.fov = fov;
		if (this.camera.fov < MIN_FOV) this.camera.fov = MIN_FOV;
		if (this.camera.fov > MAX_FOV) this.camera.fov = MAX_FOV;

		// this.camera.updateProjectionMatrix();

		// var startVec = new THREE.Vector3(0,0,0);
		// var endVec = this.obj.position.clone();

		// window.objs[0].position;

		// var alpha = 1 - ((this.camera.fov-MIN_FOV) / 65 );
		// console.log('alpha', alpha);

		// var lerpdPos = startVec.lerp(endVec,    alpha);
		// console.log('lerped',lerpdPos);
		// debugger;
		// this.camera.lookAt(lerpdPos.x,lerpdPos.y,lerpdPos.z);

		this.camera.updateProjectionMatrix();
	}

	render() {
		return (
			<div
				style={{
					display: this.props.sceneModalVisible ? 'inline' : 'none',
				}}
			>
				<div
					id="blur"
					style={{
						border: '5px solid rgb(16, 24, 32)',
						// visibility: this.state.visible ? 'visible' : 'hidden',
						// visibility: this.props.sceneModalVisible ? 'visible' : 'hidden',
						display: this.props.sceneModalVisible
							? 'inline'
							: 'none',
						backdropFilter: `blur(${this.props.blurRadius}px)`,
						WebkitBackdropFilter: `blur(${this.props.blurRadius}px)`,
						top: '0px',
						left: '0px',
						width: window.innerWidth + 'px',
						height: window.innerHeight + 'px',
						zIndex: 98,
						position: 'absolute',
					}}
				></div>

				<div
					style={{
						display: this.state.visible ? 'flex' : 'none',
						height: '100%',
						width: '100%',
						justifyContent: 'space-around',
						position: 'absolute',
						touchAction: 'none',
						// alignItems: "center",
					}}
				>
					<p
						id="text"
						style={{
							zIndex: 1000,
							display: this.state.visible ? 'inline' : 'none',
							color: '#340c0c',
							// fontWeight: 'bold',
							fontFamily: 'HelveticaNeueLTStd-HvCn',
							alignSelf: 'flex-end',
							flexDirection: 'column',
							textAlign: 'center',
							fontSize: '2rem',
							padding: '0% 5% 0% 5%',
							paddingTop: '10%',
							marginBottom: this.state.height / 7 + 'px',
							touchAction: 'none',
							pointerEvents: 'none',
						}}
					></p>
				</div>
				<div
					id="sceneModalContainer"
					ref={this.myRef}
					style={{
						width: this.state.width + 'px',
						height: this.state.height + 'px',
						// visibility: this.props.sceneModalVisible ? 'visible' : 'hidden',
						display: this.props.sceneModalVisible
							? 'inline'
							: 'none',
						top: this.state.top + 'px',
						left: this.state.left + 'px',
						zIndex: 99,
						position: 'absolute',
					}}
				>
					<div
						onClick={(e) => {
							e.stopPropagation();
							this.props.setCanTween(true);
							this.props.setCanClick(true);
							// window.canTween = true;
							// window.aModalVisible = false;
							this.props.setSceneModalVisible(false);
							window.aa = false;
							window.bb = false;
							window.cc = false;
							window.cancelAnimationFrame(window.modalAnim);
							// this.props.setVis(false)
						}}
						onTouchEnd={() => {
							this.initAnimationConditions();
						}}
						style={{
							position: 'absolute',
							background: '#340c0c',
							borderRadius: '50%',
							cursor: 'pointer',
							margin: 25 + 'px',
							zIndex: 2,
							left: '66%',
							top: '10%',
							// top:  "-1.3em",
							// left: "-1.3em",
						}}
					>
						<img
							src="https://cdn.obsess-vr.com/modal-close-icon-normal.png"
							style={{
								maxWidth: '100%',
								width: '2.8em',
								float: 'right',
							}}
						></img>
					</div>
				</div>
			</div>
		);
	}
}

export default SceneModal;
