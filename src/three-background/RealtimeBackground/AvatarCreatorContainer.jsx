import React, { Component } from 'react';
import AvatarButton from './ui/AvatarButton';
import AvatarCreator from './avatar-creator/AvatarCreator';

class AvatarCreatorContainer extends Component {
    constructor(props) {
        super(props);
		this.currentClothing = [];
		
        this.scene = this.props.scene;
        this.avatar = this.props.avatar;

        this.avatarPos = this.props.avatarPos.clone();

        this.state = {
            isAvatarCreatorActive : false,
        }
    }


    backUpAvatarClothesToArr = (avatar, arr) => {
		avatar.children[0].children.filter((object) => {return object.type == "SkinnedMesh"}).map((mesh) => {
			arr.push({name:mesh.name, texture: mesh.material.map})
		});
	}

	dressUpAvatarFromArray = (avatar, arr) => {
		arr.map((clothing) => {
			let clothMaterial = avatar.getObjectByName( clothing.name ).material;
			clothMaterial.map = clothing.texture;
			clothMaterial.needsUpdate = true
		})
	}

	backUpPosition = (pos) =>{
		this.avatarPos = pos.clone();
	}

	readBackupPosition(pos){
		pos.copy(this.avatarPos.clone());
	}
	
	setIsAvatarCreatorActive = (val) => {
		this.setState({isAvatarCreatorActive:val});
	}

	showAvatarCreator = () => {
		this.backUpAvatarClothesToArr(this.props.avatar, this.currentClothing);
		this.backUpPosition(this.props.avatar.position)
		this.setIsAvatarCreatorActive(true);
	}


	saveAvatar = () => {
		this.setIsAvatarCreatorActive(false);
		this.readBackupPosition(this.props.avatar.position);
		// this.props.avatar.position.copy(this.avatarPos.clone());
		this.currentClothing = [];
		this.scene.add(this.props.avatar);
	}

	closeAvatarCreator = () => {
		this.setIsAvatarCreatorActive(false);
		this.readBackupPosition(this.props.avatar.position);
		this.dressUpAvatarFromArray(this.props.avatar,this.currentClothing)

		this.currentClothing = [];
		this.scene.add(this.props.avatar);
	}


    render() {
        return (
            <>
                    <AvatarButton showModal={this.showAvatarCreator}/>
				{/* {this.state.isAvatarCreatorActive && <AvatarCreator
												saveAvatar={this.saveAvatar}
												closeModal={this.closeAvatarCreator}
												currentAvatar={this.props.avatar}/>} */}
            </>
        );
    }
}


export default AvatarCreatorContainer;