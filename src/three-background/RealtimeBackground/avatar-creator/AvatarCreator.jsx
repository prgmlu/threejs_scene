import React, { Component } from 'react';
import * as THREE from 'three';
// import { createScene, createRenderer } from '../threeHelpers';
import {
	setUpEnvMap,
	createScene,
	createRenderer,
	setUpNormalLights,
} from '../../threeHelpers';

import AvatarCreatorEditor from './AvatarCreatorEditor';
import Cookie from '../cookie';
import back from '../static/avatar/menus/back.png';
import close from '../static/avatar/menus/close.png';

import {AVATAR_EDITOR_AVATAR_POSITION,
	AVATAR_EDITOR_AVATAR_ROTATION} from './CustomizationConstants';

const EDIT = 'https://cdn.obsess-vr.com/realtime3d/edit.png';


import { GUI } from 'dat.gui';

const createDatGui = function(obj, folderName){
	if (!window.DATGUI_DEFINED){
		var guiDiv = document.createElement('div');
		guiDiv.style.zIndex = 99;
		guiDiv.style.position = 'fixed';
		guiDiv.style.top = '0px';
		var bod = document.getElementsByTagName('body')[0];
		bod.appendChild(guiDiv);

		const gui = new GUI({autoPlace:false});
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

	folder.add(obj.position, 'x').name('position x').min(-10).max(10).step(0.001);
	folder.add(obj.position, 'y').name('position y').min(-10).max(10).step(0.001);
	folder.add(obj.position, 'z').name('position z').min(-10).max(10).step(0.001);
}

class AvatarCreator extends Component {
	constructor(props) {
		super(props);
		this.scene = createScene();
		window.miniScene = this.scene;
		this.switchAvatar = this.props.switchAvatar;
		this.renderer = createRenderer();
		this.renderer.setSize(
			window.innerWidth * 0.3528,
			window.innerHeight * 0.6205,
		);
		this.camera = new THREE.PerspectiveCamera(
			50,
			(window.innerWidth * 0.3528) / (window.innerHeight * 0.6205),
			0.1,
			1000,
		);

		window.miniCamera = this.camera;

		// add camera helper
		// this.cameraHelper = new THREE.CameraHelper(this.camera);
		// this.scene.add(this.cameraHelper);

		// createDatGui(this.camera, Math.random());
		// createDatGui(window.femaleModel, Math.random());
		
		this.myRef = React.createRef();
		this.lastMPos = { x: 0, y: 0 };
		this.canRotate = false;
		this.currentAvatars = props?.currentAvatars;
		this.saveAvatar = props?.saveAvatar;
		this.closeModal = props?.closeModal;


		
		window.addEventListener('resize', this.handleWindowResize.bind(this));
	}

	handleWindowResize() {
		if (window.innerWidth >= 1440) {
			this.setState({ isWindowSize: true });
		} else {
			this.setState({ isWindowSize: false });
		}
	}

	state = {
		isCookieShown: false,
		username: this.props.localAvatarNameRef.current,
		isWindowSize: window.innerWidth >= 1440 ? true : false,
	};

	loadAvatar = () => {
		this.currentAvatars.forEach((i) => i.position.fromArray(AVATAR_EDITOR_AVATAR_POSITION));
		this.currentAvatars.forEach((i) => i.rotation.fromArray(AVATAR_EDITOR_AVATAR_ROTATION));
		this.currentAvatars.forEach((i) => this.scene.add(i));


	};

	rotateAvatar = (e) => {
		if (!this.canRotate) return;
		//you can only calculate the distance if therer already was a mouse event
		if (e.touches && e.touches.length == 1) {
			if (typeof this.lastMPos.x != 'undefined') {
				//calculate how far the mouse has moved
				var deltaX = this.lastMPos.x - e.touches[0].clientX;

				if (this.first) {
					deltaX = 0;
				}
				this.first = false;

				//rotate your object accordingly
				this.currentAvatars.forEach(
					(i) => (i.rotation.y -= deltaX * 0.03),
				);
			}

			//save current mouse Position for next time
			this.lastMPos = {
				x: e.touches[0].clientX,
			};
		} else {
			if (typeof this.lastMPos.x != 'undefined') {
				//calculate how far the mouse has moved
				var deltaX = this.lastMPos.x - e.clientX;

				if (this.first) {
					deltaX = 0;
				}
				this.first = false;

				//rotate your object accordingly
				this.currentAvatars.forEach(
					(i) => (i.rotation.y -= deltaX * 0.01),
				);
			}

			//save current mouse Position for next time
			this.lastMPos = {
				x: e.clientX,
			};
		}
	};

	setZoom = (fov) => {
		this.camera.fov = fov;
		if (this.camera.fov < 17) this.camera.fov = 17;
		if (this.camera.fov > 50) this.camera.fov = 50;
		this.camera.updateProjectionMatrix();
	};

	mouseWheelHandler = (e) => {
		const fovDelta = e.deltaY;
		const temp = this.camera.fov + Math.round(fovDelta * 0.04);
		this.setZoom(temp);
	};

	handleRendererMouseMove = (e) => {
		this.rotateAvatar(e);
	};

	handleMouseDown = () => {
		this.canRotate = true;
		this.first = true;
	};

	handleMouseUp = () => {
		this.canRotate = false;
	};

	componentDidMount() {
		setUpEnvMap(this.scene, this.renderer);
		setUpNormalLights(this.scene);

		this.renderer.domElement.addEventListener(
			'wheel',
			this.mouseWheelHandler,
			{ passive: true },
		);
		this.renderer.domElement.addEventListener(
			'mousemove',
			this.handleRendererMouseMove,
			true,
		);
		this.renderer.domElement.addEventListener(
			'mouseup',
			this.handleMouseUp,
			true,
		);
		this.renderer.domElement.addEventListener(
			'mousedown',
			this.handleMouseDown,
			true,
		);

		this.myRef.current.appendChild(this.renderer.domElement);

		this.loadAvatar();

		this.animate();
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		this.renderer.render(this.scene, this.camera);
	};

	handleClose = () => {
		this.setState({ isCookieShown: false });
	};

	render() {
		const { isCookieShown, username, isWindowSize } = this.state;
		return (
			<div
				className={`flex flex-col items-center justify-center w-[95%] sm:w-4/5 h-[95%] sm:h-[85%] md:h-[95%] lg:h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#7c6a6a] via-[#c1b8b8] to-[#FFF2F2] rounded-md ${
					isCookieShown && 'bg-white/50'
				} overflow-visible absolute z-30`}
			>
				{!isWindowSize && (
					<div className="md:absolute gap-2 w-[100%] sm:w-[80%] z-10 top-1 left-0 sm:left-4 px-3 sm:px-0 flex justify-between sm:justify-center items-center">
						<button
							onClick={() => this.closeModal()}
							className="flex items-center text-white text-base px-2.5 py-1.5 sm:py-1 gap-2 rounded-md cursor-pointer bg-black"
						>
							<img
								src={back}
								alt="BACK"
								className="object-contain"
							/>
							Back
						</button>
						<div className="z-50 w-fit h-fit items-center rounded-[4px] border-[1px]  border-[#330D0D] flex md:hidden">
							<img
								src={EDIT}
								alt="I"
								className="bg-[#330D0D] py-1.5 px-2.5 rounded-l-[3px]"
							/>
							<input
								className="w-20 sm:w-32 h-full z-50 font-medium outline-none text-center text-white text-sm rounded-r-[4px] px-2 py-1 bg-[#330d0d4d]"
								placeholder="Set avatar name"
								value={username}
								onChange={({ target }) =>{
									this.props.localAvatarNameRef.current = target.value;
									this.setState({ username: target.value })
								}
								}
							/>
						</div>
						<button
							onClick={() => this.closeModal()}
							className="text-center text-black uppercase text-base px-4 py-1.5 sm:py-1 gap-2 rounded-md cursor-pointer bg-white mr-0 sm:mr-6"
						>
							Save
						</button>
					</div>
				)}
				<div className="w-full h-[90%] column flex flex-col md:flex-row items-center md:mt-auto lg:mt-0">
					<div className="w-full md:w-1/2 lg:w-1/2 h-[40%] md:h-full flex flex-col items-center justify-start sm:justify-center">
						<div className="z-50 w-fit h-fit items-center mt-3 sm:mt-10 rounded-[4px] border-[1px]  border-[#330D0D] hidden md:flex">
							<img
								src={EDIT}
								alt="I"
								className="bg-[#330D0D] py-1.5 px-2.5 rounded-l-[3px]"
							/>
							<input
								className="w-20 sm:w-32 h-full z-50 font-medium outline-none text-center text-white text-sm rounded-r-[4px] px-2 py-0.5 bg-[#330d0d4d]"
								placeholder="Set avatar name"
								value={username}
								onChange={({ target }) =>{
									this.props.localAvatarNameRef.current = target.value;
									this.setState({ username: target.value })
								}
								}
							/>
						</div>
						<div
							ref={this.myRef}
							className="scale-75 md:scale-125 lg:scale-100"
						></div>
					</div>
					{this.props.currentAvatars && (
						<AvatarCreatorEditor
							femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
							maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}
							visibleGenderRef={this.props.visibleGenderRef}
							currentAvatar={this.props.currentAvatars[1]}
							maleAvatar={this.props.currentAvatars[0]}
							femaleAvatar={this.props.currentAvatars[1]}
							currentScene={this.scene}
							camera={this.camera}
							closeModal={this.props.closeModal}
							switchAvatar={this.props.switchAvatar}
						/>
					)}
				</div>

				{(window.innerWidth > 960 && window.innerHeight > 750) && (
					<button
						// onClick={() => this.setState({ isCookieShown: true })}
						className="z-40 absolute no-underline left-4 bottom-[50%] sm:bottom-[1%] mb-2 -translate-y-1/2 sm:translate-y-0  sm:left-1/2 sm:-translate-x-1/2 text-[#330D0D] text-base underline underline-offset-2 cursor-default"
					>
						By using our website, you agree to the use of cookies.
					</button>
				)}

				{isCookieShown && (
					<div className="fixed sm:absolute md:fixed lg:absolute inset-0 w-full h-full bg-black/60 sm:bg-transparent">
						<Cookie handleClose={this.handleClose} />
					</div>
				)}

				{(window.innerWidth >= 1440) &&
				(
					<img
						className="w-12 h-12 cursor-pointer absolute top-[-20px] right-[-20px] z-50"
						src={close}
						alt="CLOSE"
						onClick={() => this.closeModal()}
					/>
				)}
			</div>
		);
	}
}

export default AvatarCreator;
