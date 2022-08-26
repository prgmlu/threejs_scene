import React, { Component } from 'react';
import * as THREE from 'three';
import { createDatGui, setFaceTransforms } from './positionHelper';
import { Water } from './Water';

// const DEBUG = true;
const DEBUG = false;

export default class WaterEffect extends Component {
	constructor(props) {
		super(props);
		this.scene = props.scene || props.sceneRef.current;

		this.waterGeometry = new THREE.PlaneGeometry(1, 1);
		this.position = props.position;
		this.rotation = props.rotation;
		this.scale = props.scale;

		this.alpha = props.alpha || 1;
		this.distortionScale = props.distortionScale || 0.5;

		this.size = props.size || 400;
		this.color = props.color || 0xeeeeee;

		this.water = new Water(this.waterGeometry, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load(
				'https://cdn.obsess-vr.com/bravo/waternormals.jpg',
				function (texture) {
					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				},
			),
			waterColor: this.color,
			distortionScale: this.distortionScale,
			fog: this.scene.fog !== undefined,
			alpha: this.alpha,
			// alphaMap: this.alphaMap
		});

		window.water = this.water;

		this.water.position.set(...props.position);
		this.water.rotation.set(...props.rotation);
		this.water.scale.set(...props.scale);

		this.water.material.uniforms.size.value = this.size;
		this.water.material.transparent = true;
		this.water.material.opacity = 0.5;
		this.water.material.side = THREE.DoubleSide;

		this.scene.add(this.water);
		this.animate();
	}

	componentDidMount() {
		if (DEBUG == true) createDatGui(this.water);
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		this.renderWater();
	};

	renderWater = () => {
		const time = performance.now() * 0.001;
		this.water.material.uniforms['time'].value += 1.0 / 60.0;
	};

	componentWillUnmount() {
		this.scene.remove(this.water);
	}

	render() {
		return <div></div>;
	}
}
