import React, { Component } from 'react';
import * as THREE from 'three';
import TabControls from './customize/TabControls';
import Outfit from './customize/Outfit';
import Face from './customize/Face';
import BodyShape from './customize/BodyShape';
import Makeup from './customize/Makeup';
import {AVATAR_EDITOR_AVATAR_POSITION,
	AVATAR_EDITOR_AVATAR_ROTATION,
	ZOOM_ON_FACE_POSITION,
	ZOOM_ON_FACE_ROTATION
	
} from './CustomizationConstants';

class AvatarCreatorEditor extends Component {
	constructor(props) {
		super(props);
		this.camera = this.props.camera;
		this.switchAvatar = this.props.switchAvatar;
		this.closeModal = this.props.closeModal;
		this.textureLoader = new THREE.TextureLoader();
		this.parsed = JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current);

		this.selectedMakeup = this.parsed.makeup;

		if(this.selectedMakeup || this.selectedMakeup == 0){
			this.selectedMakeup = this.selectedMakeup;
		}
			
		else{
			this.selectedMakeup = null;
		}

		this.state = {
			activeTab: 1,
			bodyType: 'male',
			selectedOutfit: -1,
			selectedSkintone: JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).skinTone || null,
			skintoneX: 0,
			skintoneY: 0,
			selectedMakeup: this.selectedMakeup,
			selectedBodyshape: 'female',
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
		};
		
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
			// this.camera.position.set(0, 0, 0)
			// this.camera.fov = 50;
			// this.camera.updateProjectionMatrix();
			this.props.femaleAvatar.position.fromArray(AVATAR_EDITOR_AVATAR_POSITION);
			this.props.maleAvatar.position.fromArray(AVATAR_EDITOR_AVATAR_POSITION);

			this.props.femaleAvatar.rotation.fromArray(AVATAR_EDITOR_AVATAR_ROTATION);
			this.props.maleAvatar.rotation.fromArray(AVATAR_EDITOR_AVATAR_ROTATION);
		}
		if (id == 2) {
			// face
			// this.camera.position.set(0, 0.6, -.8)
			// this.camera.fov = 20;
			// this.camera.updateProjectionMatrix();
			this.props.femaleAvatar.position.fromArray(ZOOM_ON_FACE_POSITION)
			this.props.maleAvatar.position.fromArray(ZOOM_ON_FACE_POSITION)
			
			this.props.femaleAvatar.rotation.fromArray(ZOOM_ON_FACE_ROTATION)
			this.props.maleAvatar.rotation.fromArray(ZOOM_ON_FACE_ROTATION)
		}
		if (id == 3) {
			//makup
			// this.camera.position.set(0, 0.6, -.8)
			// this.camera.fov = 20;
			// this.camera.updateProjectionMatrix();
			this.props.femaleAvatar.position.fromArray(ZOOM_ON_FACE_POSITION)
			this.props.maleAvatar.position.fromArray(ZOOM_ON_FACE_POSITION)
			
			this.props.femaleAvatar.rotation.fromArray(ZOOM_ON_FACE_ROTATION)
			this.props.maleAvatar.rotation.fromArray(ZOOM_ON_FACE_ROTATION)
		}
		if (id == 4) {
			//outfit
			// this.camera.position.set(0, 0, 0)
			// this.camera.fov = 50;
			// this.camera.updateProjectionMatrix();
			this.props.femaleAvatar.position.fromArray(AVATAR_EDITOR_AVATAR_POSITION);
			this.props.maleAvatar.position.fromArray(AVATAR_EDITOR_AVATAR_POSITION);

			this.props.femaleAvatar.rotation.fromArray(AVATAR_EDITOR_AVATAR_ROTATION);
			this.props.maleAvatar.rotation.fromArray(AVATAR_EDITOR_AVATAR_ROTATION);
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
			<div className="w-full md:w-[80%] lg:w-[45%] min-h-[80%] sm:min-h-[80%] md:min-h-[64%] h-[60%] md:h-full flex flex-col relative justify-start items-center sm:items-start relative">
				<TabControls
					activeTab={activeTab}
					onTabClick={this.onTabClick}
				/>
				<div className="w-full md:w-[95%] mx-auto sm:w-[95%] overflow-y-auto h-[70%]  md:h-[90%] sm:h-[90%] mb-3 sm:mb-0 white-shadow-container bg-white rounded-lg gap-x-2 md:pt-3 lg:pt-3 xl:pt-3 sm:pt-1 px-3 relative">
					{activeTab == 1 && (
						<BodyShape

							femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
							maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}
							visibleGenderRef={this.props.visibleGenderRef}

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
							maleAvatar={this.props.maleAvatar}
							femaleAvatar={this.props.femaleAvatar}
						/>
					)}
					{activeTab == 2 && (
						<Face

							femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
							maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}
							visibleGenderRef={this.props.visibleGenderRef}

							selectedSkintone={this.state.selectedSkintone}
							currentAvatar={this.props.currentAvatar}
							maleAvatar={this.props.maleAvatar}
							femaleAvatar={this.props.femaleAvatar}
						/>
					)}
					{activeTab == 3 && (
						<Makeup

							femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
							maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}
							visibleGenderRef={this.props.visibleGenderRef}


							selectedMakeup={this.state.selectedMakeup}
							setSelectedMakeup={this.setSelectedMakeup.bind(
								this,
							)}
							selectedSkintone={this.state.selectedSkintone}
							currentAvatar={this.props.currentAvatar}
							maleAvatar={this.props.maleAvatar}
							femaleAvatar={this.props.femaleAvatar}
						/>
					)}
					{activeTab == 4 && (
						<Outfit

							femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
							maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}
							visibleGenderRef={this.props.visibleGenderRef}

							selectedOutfit={selectedOutfit}
							maleOutfits={this.maleOutfits}
							setOutfit={this.setOutfit}
							currentAvatar={this.props.currentAvatar}
							maleAvatar={this.props.maleAvatar}
							femaleAvatar={this.props.femaleAvatar}
						/>
					)}
				</div>
				{windowWidth >= 1440 && (
					<div className="w-full flex justify-end items-center mt-4">
						<button
							style={{ border: '1px solid #330D0D' }}
							className="w-fit h-fit self-center uppsercase duration-250 text-[#fff] bg-[#330D0D] hover:bg-white hover:text-[#330D0D] px-[2.5rem] py-[0.5rem] text-sm rounded-md cursor-pointer"
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
