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
const EDIT = 'https://cdn.obsess-vr.com/realtime3d/edit.png';

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
		username: '',
		isWindowSize: window.innerWidth >= 1440 ? true : false,
	};

	loadAvatar = () => {
		this.currentAvatars.forEach((i) => i.position.set(0, -1.3, -3.2));
		this.currentAvatars.forEach((i) => i.rotation.set(0, 0, 0, 'XYZ'));
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
					<div className="absolute w-full sm:w-fit z-10 top-1 left-0 sm:left-4 px-3 sm:px-0 flex justify-between sm:justify-start items-center">
						<button
							onClick={() => this.closeModal()}
							className="flex items-center text-white text-base px-2.5 py-1.5 sm:py-1 gap-2 rounded-md cursor-pointer bg-black mr-0 sm:mr-6"
						>
							<img
								src={back}
								alt="BACK"
								className="object-contain"
							/>
							Back
						</button>
						<button
							onClick={() => this.closeModal()}
							className="text-center text-black text-base px-4 py-1.5 sm:py-1 gap-2 rounded-md cursor-pointer bg-white mr-0 sm:mr-6"
						>
							Save
						</button>
					</div>
				)}
				<div className="w-full h-[90%] flex flex-col sm:flex-row items-center">
					<div className="w-full sm:w-1/2 md:w-2/5 lg:w-1/2 h-1/2 sm:h-full flex flex-col items-center justify-start sm:justify-center">
						<div className="z-50 w-fit h-fit flex items-center mt-3 sm:mt-10 rounded-[4px] border-[1px]  border-[#330D0D]">
							<img
								src={EDIT}
								alt="I"
								className="bg-[#330D0D] py-1.5 px-2.5 rounded-l-[3px]"
							/>
							<input
								className="w-20 sm:w-32 h-full z-50 font-medium outline-none text-center text-white text-sm rounded-r-[4px] px-2 py-0.5 bg-[#330d0d4d]"
								placeholder="Set avatar name"
								value={username}
								onChange={({ target }) =>
									this.setState({ username: target.value })
								}
							/>
						</div>
						<div
							ref={this.myRef}
							className="scale-75 sm:scale-100 md:scale-125 lg:scale-100"
						></div>
					</div>
					{this.props.currentAvatars && (
						<AvatarCreatorEditor
							currentAvatar={this.props.currentAvatars[1]}
							currentScene={this.scene}
							camera={this.camera}
							closeModal={this.props.closeModal}
							switchAvatar={this.props.switchAvatar}
						/>
					)}
				</div>

				{(window.innerWidth > 960 && window.innerHeight > 750) && (
					<button
						onClick={() => this.setState({ isCookieShown: true })}
						className="z-40 absolute no-underline left-4 bottom-[50%] sm:bottom-[1%] mb-2 -translate-y-1/2 sm:translate-y-0  sm:left-1/2 sm:-translate-x-1/2 font-bold text-[#330D0D] text-base underline underline-offset-2 cursor-pointer"
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
