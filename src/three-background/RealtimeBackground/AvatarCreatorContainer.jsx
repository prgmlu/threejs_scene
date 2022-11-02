import React, { Component } from 'react';
import AvatarButton from './ui/AvatarButton';
import AvatarCreator from './avatar-creator/AvatarCreator';
import { dressUpFromString } from '../../three-controls/CharacterControls/OutfitTranslator';

const CUSTOMIZE_AVATAR = false;
class AvatarCreatorContainer extends Component {
	constructor(props) {
		console.log('AvatarCreatorContainer constructor');
		super(props);
		// alert('cons')
		this.currentClothing = [];

		this.scene = this.props.scene;
		this.avatars = this.props.avatars;

		this.charControls = this.props.charControls;

		this.avatarPos = this.props.avatarPos.clone();

		this.switchAvatar = this.props.switchAvatar;

		window.showAvatarCreator = this.showAvatarCreator.bind(this);

		if (CUSTOMIZE_AVATAR) {
			this.state = {
				//!!! WARNING, change from CUSTOMIZE_AVATAR instead
				isAvatarCreatorActive: true,
			};
			this.charControls.setEnabled(false);
		} else {
			this.state = {
				isAvatarCreatorActive: false,
			};
		}
	}

	backUpAvatarClothesToArr = (avatar, arr) => {
		avatar.children[0].children
			.filter((object) => {
				return object.type == 'SkinnedMesh';
			})
			.map((mesh) => {
				arr.push({ name: mesh.name, texture: mesh.material.map });
			});
	};

	dressUpAvatarFromArray = (avatar, arr) => {
		arr.map((clothing) => {
			let clothMaterial = avatar.getObjectByName(clothing.name).material;
			clothMaterial.map = clothing.texture;
			clothMaterial.needsUpdate = true;
		});
	};

	backUpPosition = (pos) => {
		this.avatarPos = pos.clone();
	};

	readBackupPosition(poss) {
		poss.forEach((pos) => {
			pos.copy(this.avatarPos.clone());
		});
	}

	setIsAvatarCreatorActive = (val) => {
		this.setState({ isAvatarCreatorActive: val });
		if (val) {
			this.charControls.setEnabled(false);
		} else {
			this.charControls.setEnabled(true);
		}
	};

	showAvatarCreator = () => {
		// this.backUpAvatarClothesToArr(this.props.avatars[0], this.currentClothing);
		
		window.backupOutfitString = String(this.props.femaleLocalAvatarOutfitStringRef.current);
		this.backUpPosition(this.props.avatars[0].position);
		this.setIsAvatarCreatorActive(true);
	};

	saveAvatar = () => {
		this.setIsAvatarCreatorActive(false);
		this.readBackupPosition([
			this.props.avatars[0].position,
			this.props.avatars[1].position,
		]);
		this.props.avatar.rotation.set(0,0,0);
		this.props.avatars.forEach((i) => {
			this.scene.add(i);
		});
	};

	closeAvatarCreator = () => {
		this.setIsAvatarCreatorActive(false);
		this.readBackupPosition([
			this.props.avatars[0].position,
			this.props.avatars[1].position,
		]);
		this.props.avatar.rotation.set(0,0,0);

		this.currentClothing = [];
		this.props.avatars.forEach((i) => {
			this.scene.add(i);
		});
		// this.props.localAvatarOutfitStringRef.current = window.backupOutfitString;
		this.props.femaleLocalAvatarOutfitStringRef.current = window.backupOutfitString;
		this.props.maleLocalAvatarOutfitStringRef.current = window.backupOutfitString;

		//dressupfromstring
		dressUpFromString(this.props.avatars[0], window.backupOutfitString);
		dressUpFromString(this.props.avatars[1], window.backupOutfitString);
		
	};

	render() {
		return (
			<div>
				{/* <AvatarButton showModal={this.showAvatarCreator} /> */}
				{this.state.isAvatarCreatorActive && (
					<AvatarCreator
						localAvatarNameRef={this.props.localAvatarNameRef}
						localAvatarOutfitStringRef={
							this.props.localAvatarOutfitStringRef
						}

						femaleLocalAvatarOutfitStringRef={this.props.femaleLocalAvatarOutfitStringRef}
						maleLocalAvatarOutfitStringRef={this.props.maleLocalAvatarOutfitStringRef}

						visibleGenderRef={this.props.visibleGenderRef}

						active={this.state.isAvatarCreatorActive}
						saveAvatar={this.saveAvatar}
						closeModal={this.closeAvatarCreator}
						switchAvatar={this.props.switchAvatar}
						currentAvatars={this.props.avatars}
					/>
				)}
			</div>
		);
	}
}

export default AvatarCreatorContainer;
