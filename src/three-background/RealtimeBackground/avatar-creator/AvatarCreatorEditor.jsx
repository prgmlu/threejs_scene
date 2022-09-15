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
		this.textureLoader = new THREE.TextureLoader();
		this.maleOutfits = {
			display: [
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (7).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (8).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (9).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (10).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (7).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (8).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (9).png',
				'https://cdn.obsess-vr.com/realtime3d/outfits/image (10).png',
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

	onTabClick = (id) => {
		this.setState({ activeTab: id });
		if (id == 1) {
			//body shape
			this.camera.position.set(0, 0, 0)
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
		if (id == 2) {
			// face
			this.camera.position.set(0.015, 0.235, -2.5)
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
		if (id == 3) {
			//makup
			this.camera.position.set(0.015,0.235,-2.5)
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
		if (id == 4) {
			//outfit
			this.camera.position.set(0, 0, 0)
			this.camera.fov = 50;
			this.camera.updateProjectionMatrix();
		}
	};

	setBodyType = (e) => {
		this.setState({ bodyType: e.target.id });
	};

	setOutfit = (e, index) => {
		this.setState({ selectedOutfit: index }, () => {});

		let selectedItem = this.maleOutfits.textures.filter((texture) => {
			return texture.name == e.target.id;
		})[0];
		let selectedTexture = this.textureLoader.load(selectedItem.src);
		this.currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.map = selectedTexture;
		this.currentScene.children[0].children[0].getObjectByName(
			e.target.className,
		).material.needsUpdate = true;
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
			<div className="w-full sm:w-1/2 md:w-[80%] lg:w-[45%] h-1/2 sm:h-full flex flex-col justify-between sm:justify-start items-center sm:items-start relative md:gap-2 lg:gap-0">
				<TabControls
					activeTab={activeTab}
					onTabClick={this.onTabClick}
				/>
				<div className="w-[96%] sm:w-full md:w-[95%] lg:w-[85%] h-[80%]  md:h-[70%] bg-white rounded-lg gap-x-2 pt-3 px-3 relative">
					{activeTab == 1 && (
						<BodyShape
							skintoneX={this.state.skintoneX}
							skintoneY={this.state.skintoneY}
							setSkintonXY={this.setSkintoneXY.bind(this)}
							selectedMakeup={this.state.selectedMakeup}
							setSelectedSkintone={this.setSelectedSkintone.bind(
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
						/>
					)}
				</div>
			</div>
		);
	}
}

export default AvatarCreatorEditor;
