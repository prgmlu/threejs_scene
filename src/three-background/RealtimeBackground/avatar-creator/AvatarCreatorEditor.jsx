import React, { Component } from 'react';
import * as THREE from 'three';
import TabControls from './customize/TabControls';
import Outfit from './customize/Outfit';
import Face from './customize/Face';
import BodyShape from './customize/BodyShape';
import Makeup from './customize/Makeup';

class AvatarCreatorEditor extends Component {
	constructor(props) {
		super(props);
		this.camera = this.props.camera;
		this.switchAvatar = this.props.switchAvatar;
		this.closeModal = this.props.closeModal;
		this.textureLoader = new THREE.TextureLoader();
		this.maleOutfits = {
			display: [
				'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfits/outfit1.png',
				'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfits/outfit2.png',
				'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfits/outfit3.png',
				'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfits/outfit4.png',
				'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfits/outfit5.png',
			],
		};
		this.currentScene = props?.currentScene;
		this.currentAvatar = {};

		//add eventlistener to handle resize
		window.addEventListener('resize', this.handleWindowResize.bind(this));
	}

	handleWindowResize() {
		//set the state of the window size
		this.setState({
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
		});
	}

	state = {
		activeTab: 1,
		bodyType: 'male',
		selectedOutfit: -1,
		selectedSkintone: 1,
		skintoneX: 0,
		skintoneY: 0,
		selectedMakeup: null,
		selectedBodyshape: 'female',
		windowWidth: window.innerWidth,
		windowHeight: window.innerHeight,
	};

	setSkintoneXY(x, y) {
		this.setState({ skintoneX: x, skintoneY: y });
	}

	setSelectedSkintone = (skintone) => {
		this.setState({
			selectedSkintone: skintone,
		});
	};

	setSelectedMakeup = (makeup) => {
		this.setState({
			selectedMakeup: makeup,
		});
	};

	setSelectedBodyshape = (bodyshape) => {
		// this.switchAvatar(bodyshape);
		this.setState({
			selectedBodyshape: bodyshape,
		});
	};

	onTabClick = (id) => {
		this.setState({ activeTab: id });
		if (id == 1) {
			//body shape
			this.camera.position.set(0, 0, 0);
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
		if (id == 2) {
			// face
			this.camera.position.set(0.015, 0.235, -2.5);
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
		if (id == 3) {
			//makup
			this.camera.position.set(0.015, 0.235, -2.5);
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
		if (id == 4) {
			//outfit
			this.camera.position.set(0, 0, 0);
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
	};

	setBodyType = (e) => {
		this.setState({ bodyType: e.target.id });
	};

	setOutfit = (e, index) => {
		this.setState({ selectedOutfit: index }, () => {});

		// let selectedItem = this.maleOutfits.textures.filter((texture) => {
		// 	return texture.name == e.target.id;
		// })[0];
		// let selectedTexture = this.textureLoader.load(selectedItem.src);
		// this.currentScene.children[0].children[0].getObjectByName(
		// 	e.target.className,
		// ).material.map = selectedTexture;
		// this.currentScene.children[0].children[0].getObjectByName(
		// 	e.target.className,
		// ).material.needsUpdate = true;
	};

	handlePicker = (value) => {
		this.setState({
			color: value,
		});
	};

	handleClose = () => this.setState({ isPickerVisible: false });

	// componentDidMount() {

	// }

	render() {
		const { selectedOutfit, activeTab, windowWidth } = this.state;
		return (
			<div className="w-full sm:w-1/2 md:w-[80%] lg:w-[45%] h-1/2 sm:h-full flex flex-col relative justify-start items-center sm:items-start relative">
				<TabControls
					activeTab={activeTab}
					onTabClick={this.onTabClick}
				/>
				<div className="w-full md:w-[95%] sm:w-[95%] overflow-y-auto h-[70%] md:h-[90%] sm:h-[90%] mb-3 sm:mb-0 white-shadow-container bg-white rounded-lg gap-x-2 md:pt-3 lg:pt-3 xl:pt-3 sm:pt-1 px-3 relative">
					{activeTab == 1 && (
						<BodyShape
							skintoneX={this.state.skintoneX}
							skintoneY={this.state.skintoneY}
							setSkintonXY={this.setSkintoneXY.bind(this)}
							selectedMakeup={this.state.selectedMakeup}
							setSelectedSkintone={this.setSelectedSkintone.bind(
								this,
							)}
							selectedBodyshape={this.state.selectedBodyshape}
							setSelectedBodyshape={this.setSelectedBodyshape.bind(
								this,
							)}
							currentAvatar={this.props.currentAvatar}
						/>
					)}
					{activeTab == 2 && (
						<Face
							selectedSkintone={this.state.selectedSkintone}
							currentAvatar={this.props.currentAvatar}
						/>
					)}
					{activeTab == 3 && (
						<Makeup
							selectedMakeup={this.state.selectedMakeup}
							setSelectedMakeup={this.setSelectedMakeup.bind(
								this,
							)}
							selectedSkintone={this.state.selectedSkintone}
							currentAvatar={this.props.currentAvatar}
						/>
					)}
					{activeTab == 4 && (
						<Outfit
							selectedOutfit={selectedOutfit}
							maleOutfits={this.maleOutfits}
							setOutfit={this.setOutfit}
							currentAvatar={this.props.currentAvatar}
						/>
					)}
				</div>
				{windowWidth > 1440 && (
					<div className="w-full flex justify-end items-center mt-4">
						<button
							style={{ border: '1px solid #330D0D' }}
							className="w-fit h-fit self-center bg-white text-[#330D0D] px-[2.5rem] py-[0.5rem] text-sm rounded-md cursor-pointer"
							onClick={this.props.closeModal}
						>
							Save
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default AvatarCreatorEditor;
