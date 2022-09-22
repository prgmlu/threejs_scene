import React, { Component } from 'react';
import './AvatarButton.css';
//import edit from '../static/avatar/editavatar.svg'; we need a loader here
const avatarIcon = 'https://cdn.obsess-vr.com/avatarIcon.png';

export default class AvatarButton extends Component {
	constructor(props) {
		super(props);
		this.showModal = props?.showModal;
	}

	render() {
		return (
			<div className="avatar-editor-button" onClick={this.showModal}>
				<img
					className="avatar-editor-icon"
					src={
						'https://cdn.obsess-vr.com/realtime3d/ct_ui/edit_avatar.svg'
					}
					//src={edit}
				/>
			</div>
		);
	}
}
