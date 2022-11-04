import React, { Component } from 'react';
import * as THREE from 'three';
import TabControls from './customize/TabControls';
import Outfit from './customize/Outfit';
import Face from './customize/Face';
import BodyShape from './customize/BodyShape';
import Makeup from './customize/Makeup';
import outfit1 from '../static/avatar/outfit/female/Outfit1.png';
import outfit2 from '../static/avatar/outfit/female/Outfit2.png';
import outfit3 from '../static/avatar/outfit/female/Outfit3.png';
import outfit4 from '../static/avatar/outfit/female/Outfit4.png';
import outfit5 from '../static/avatar/outfit/female/Outfit5.png';

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
		this.hairColor = this.parsed.hairColor;

		// this.eyeColor = this.parsed.eyeColor;

		if(this.hairColor){
			this.hairColor = this.hairColor;
		}
		else{
			this.hairColor = null;
		}

		// if(this.eyeColor){
		// 	this.eyeColor = this.eyeColor;
		// }
		// else{
		// 	this.eyeColor = null;
		// }


		if(this.selectedMakeup || this.selectedMakeup == 0){
			this.selectedMakeup = this.selectedMakeup;
		}
			
		else{
			this.selectedMakeup = null;
		}

		this.selectedOutfit = JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).outfitMesh || null;
		// extract the number at the end of this.selectedOutfit
		this.outfitNumber = Number(this.selectedOutfit.charAt(this.selectedOutfit.length - 1));



		this.state = {
			activeTab: 1,
			bodyType: 'male',
			selectedOutfit: this.outfitNumber-1,
			selectedSkintone: JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).skinTone || null,
			skintoneX: JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).skinTone -1 || null,
			skintoneY: JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).skinTone -1 || null,
			selectedMakeup: this.selectedMakeup,
			selectedBodyshape: 'female',
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
			hairColor : JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).hairColor,
			eyeColor : JSON.parse(this.props.femaleLocalAvatarOutfitStringRef.current).eyeColor,
		};



		
		this.maleOutfits = {
			display: [
				outfit1, outfit2, outfit3, outfit4, outfit5
			],
		};
		this.currentScene = props?.currentScene;
		this.currentAvatar = {};

		//add eventlistener to handle resize
		window.addEventListener('resize', this.handleWindowResize.bind(this));
	}

	setHairColor(color){
		this.setState({hairColor: color});
	}

	setEyeColor(color){
		this.setState({eyeColor: color});
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
			<div className="w-full md:w-[80%] lg:w-[45%] min-h-[80%] sm:min-h-[80%] md:min-h-[64%] self-start md:h-full flex flex-col relative justify-start items-center sm:items-start relative">
				<TabControls
					activeTab={activeTab}
					onTabClick={this.onTabClick}
				/>
				<div className="w-full md:w-[95%] mx-auto sm:w-[95%] overflow-visible h-[70%] sm:h-[65%] pt-3 sm:pt-none md:h-[84%] mb-3 sm:mb-0 white-shadow-container bg-white rounded-lg gap-x-2 md:pt-3 lg:pt-3 xl:pt-3 sm:pt-1 px-3 relative">
					{activeTab == 1 && (
						<BodyShape
							femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
							maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}
							visibleGenderRef={this.props.visibleGenderRef}
							skintoneX={this.state.skintoneX}
							skintoneY={this.state.skintoneY}
							setSkintonXY={this.setSkintoneXY.bind(this)}
							selectedMakeup={this.state.selectedMakeup}
							selectedSkintone={this.state.selectedSkintone}
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

							hairColor={this.state.hairColor}
							setHairColor={this.setHairColor.bind(this)}

							eyeColor={this.state.eyeColor}
							setEyeColor={this.setEyeColor.bind(this)}


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
					<div className="w-full flex justify-end items-center">
						<button
							style={{ border: '1px solid #330D0D' }}
							className="w-fit h-fit self-center duration-250 text-[#fff] bg-[#330D0D] hover:bg-white hover:text-[#330D0D] px-[2.5rem] py-[0.5rem] text-sm rounded-md cursor-pointer"
							onClick={this.props.saveAvatar}
						>
							SAVE
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default AvatarCreatorEditor;
