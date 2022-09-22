import React, { Component } from 'react'
import './AvatarButton.css';

const avatarIcon = "https://cdn.obsess-vr.com/avatarIcon.png";
import editAvatarIcon from '../static/avatar/menus/edit avatar.png'

export default class AvatarButton extends Component {
	constructor(props){
		super(props)
        this.showModal = props?.showModal;
	}

	render() {
		return (
            <div className='avatar-editor-button' onClick={this.showModal}>
                <img className='avatar-editor-icon' 
                // src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/edit_avatar.svg"}
                src={editAvatarIcon}
                 />
            </div>
        )
    }
}