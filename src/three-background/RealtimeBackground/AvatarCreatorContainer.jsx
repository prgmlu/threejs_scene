import React, { Component } from 'react';
import AvatarButton from './ui/AvatarButton';
import AvatarCreator from './avatar-creator/AvatarCreator';
import close from './static/avatar/menus/close.png';

const CUSTOMIZE_AVATAR = false;
class AvatarCreatorContainer extends Component {
	constructor(props) {
		super(props);
		this.currentClothing = [];

		this.scene = this.props.scene;
		this.avatars = this.props.avatars;

		this.charControls = this.props.charControls;

		this.avatarPos = this.props.avatarPos.clone();

		this.switchAvatar = this.props.switchAvatar;

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
	poss.forEach((pos)=>{
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
		this.backUpPosition(this.props.avatars[0].position);
		this.setIsAvatarCreatorActive(true);
	};

	saveAvatar = () => {
		this.setIsAvatarCreatorActive(false);
		this.readBackupPosition(this.props.avatar.position);
		// this.props.avatar.position.copy(this.avatarPos.clone());
		this.currentClothing = [];
		// this.scene.add(this.props.avatar);
		this.props.avatars.forEach((i)=>{
			this.scene.add(i);
		})
	};

	closeAvatarCreator = () => {
		this.setIsAvatarCreatorActive(false);
		this.readBackupPosition([this.props.avatars[0].position,this.props.avatars[1].position]);
		// this.dressUpAvatarFromArray(this.props.avatar, this.currentClothing);

		this.currentClothing = [];
		// this.scene.add(this.props.avatar);
		this.props.avatars.forEach((i)=>{
			this.scene.add(i);
		})
	};

	render() {
		return (
			<div className="w-full h-full relative">


				<AvatarButton showModal={this.showAvatarCreator}/>
				{this.state.isAvatarCreatorActive && <AvatarCreator
						localAvatarNameRef={this.props.localAvatarNameRef}
						localAvatarOutfitStringRef={this.props.localAvatarOutfitStringRef}
						active={this.state.isAvatarCreatorActive}
						saveAvatar={this.saveAvatar}
						closeModal={this.closeAvatarCreator}
						switchAvatar={this.props.switchAvatar}
						currentAvatars={this.props.avatars}/>}
										{window.innerWidth >= 1440 &&
					this.state.isAvatarCreatorActive && (
						<img
							className="w-12 h-12 cursor-pointer absolute top-[6%] right-[9.25%] z-50"
							src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/x_button.svg"}
							alt="CLOSE"
							onClick={() => this.closeAvatarCreator()}
						/>
					)}
            </div>
        );
    }
}

export default AvatarCreatorContainer;