import React, { Component } from 'react';
import * as THREE from 'three';
// import { createScene, createRenderer } from '../threeHelpers';
import { setUpEnvMap, createScene, createRenderer, setUpNormalLights } from '../../threeHelpers'

import AvatarCreatorEditor from './AvatarCreatorEditor';
import back from '../static/avatar/menus/back.png';
import Cookie from '../cookie';
import close from '../static/avatar/menus/close.png';
import { MobileOnlyView } from 'react-device-detect';

class AvatarCreator extends Component {
	constructor(props) {
		super(props);
		this.scene = createScene();
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
		this.currentAvatar = props?.currentAvatar;
		this.saveAvatar = props?.saveAvatar;
		this.closeModal = props?.closeModal;
	}

	state = {
		isCookieShown: false,
		username: '',
	};

	loadAvatar = () => {
		this.currentAvatar.position.set(0, -1.3, -3.1);
		this.currentAvatar.rotation.set(0, 0, 0, 'XYZ');
		this.scene.add(this.currentAvatar);
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
				this.currentAvatar.rotation.y -= deltaX * 0.03;
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
				this.currentAvatar.rotation.y -= deltaX * 0.01;
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
		const { isCookieShown, username } = this.state;
		return (
			<div
				className={`flex flex-col items-center justify-center w-[95%] sm:w-4/5 h-[95%] sm:h-[85%] md:h-[95%] lg:h-[85%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#7c6a6a] via-[#c1b8b8] to-[#FFF2F2] rounded-md ${
					isCookieShown && 'bg-white/50'
				} overflow-hidden absolute z-0`}
			>
				{!MobileOnlyView && (
					<img
						className="w-7 h-77 cursor-pointer absolute -top-2 -right-2 z-20"
						src={close}
						alt="CLOSE"
						onClick={() => this.closeModal()}
					/>
				)}
				<div className="absolute w-full sm:w-fit z-10 top-3 left-0 sm:left-4 px-3 sm:px-0 flex justify-between sm:justify-start items-center">
					<button
						onClick={() => this.closeModal()}
						className="flex items-center text-white text-base px-2 py-11 gap-2 rounded-md cursor-pointer bg-black mr-0 sm:mr-6"
					>
						<img src={back} alt="BACK" className="object-contain" />
						Back
					</button>
					<button className="text-center text-black text-base px-6 py-11 gap-2 rounded-md cursor-pointer bg-white mr-0 sm:mr-6">
						Save
					</button>
				</div>
				<div className="w-full h-full sm:h-3/4 md:h-[90%]  lg:h-3/4 flex flex-col sm:flex-row items-center">
					<div className="w-full sm:w-1/2 md:w-2/5 lg:w-1/2 h-1/2 sm:h-full flex flex-col items-center justify-start sm:justify-center">
						<input
							className="w-32 z-50 outline-none text-center text-white text-base rounded px-6 py-11 mt-[11px] sm:mt-0 border-[1px] border-[#330D0D] bg-[#330d0d4d]"
							placeholder="Username"
							value={username}
							onChange={({ target }) =>
								this.setState({ username: target.value })
							}
						/>
						<div
							ref={this.myRef}
							className="scale-75 sm:scale-100 md:scale-150 lg:scale-125"
						></div>
					</div>
					{this.props.currentAvatar && <AvatarCreatorEditor currentAvatar={this.props.currentAvatar} currentScene={this.scene}
					camera={this.camera}
					 />}
				</div>

				<button
						onClick={() => this.setState({ isCookieShown: true })}
						className="z-50 absolute left-4 bottom-[55%] -translate-y-1/2  sm:bottom-12 sm:left-1/2 sm:-translate-x-1/2 font-bold text-[#330D0D] text-base underline underline-offset-2 cursor-pointer"
					>
						Cookie Policy
					</button>

				{isCookieShown && (
					<div className="fixed sm:absolute md:fixed lg:absolute inset-0 w-full h-full bg-black/60 sm:bg-transparent">
						<Cookie handleClose={this.handleClose} />{' '}
					</div>
				)}
			</div>
		);
	}
}

export default AvatarCreator;
