import React, { Component } from 'react';
import './Logo.css';

const style = {
	width: '50%',
};

class Logo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSrc: 'https://cdn.obsess-vr.com/Obsess-color-logo-32.png',
			redirectUrl: '',
		};
	}

	onClick = () =>{
	}

	render() {
		const imageSrc = this.state.imageSrc;
		if (!imageSrc) {
			return <React.Fragment />;
		}
		return (
			<div id="topLeftLogo" className="hoverable">
			<img
				onClick={this.onClick}
                src={imageSrc}
                style={style}
            />
			</div>
		);
	}
}

export default Logo;
