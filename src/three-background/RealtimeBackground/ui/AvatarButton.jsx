import React, { Component } from 'react'
import './AvatarButton.css';

const avatarIcon = "https://cdn.obsess-vr.com/avatarIcon.png";

export default class AvatarButton extends Component {
	constructor(props){
		super(props)
        this.showModal = props?.showModal;
	}

	render() {
		return (
            <div className='avatar-editor-button' onClick={this.showModal}>
                <img className='avatar-editor-icon' src={avatarIcon} />
            </div>
        )
    }
}