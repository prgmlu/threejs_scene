import React, { Component } from 'react'
import Logo from './Logo.jsx';
import BottomBarRight from './BottomBarRight'


export default class UI_Layer extends Component {
	constructor(){
		super()
	}

	render() {
		return (
			<div className="ui_layer">
                <Logo/>
				<BottomBarRight/>
			</div>
		)
	}
}