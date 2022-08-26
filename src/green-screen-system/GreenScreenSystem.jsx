import React, { Component } from 'react';
import GreenScreenedVid from './GreenScreenedVid.jsx';
import * as THREE from 'three';
import { createDatGui } from './helpers.js';

const DEBUG = false;

const getFacePos = (face) => {
	switch (face) {
		case 'front':
			return { x: -10 + 0.001, y: 0, z: 0 };
		case 'right':
			return { x: 0, y: 0, z: -10 + 0.001 };
		case 'back':
			return { x: 10 - 0.001, y: 0, z: 0 };
		case 'top':
			return { x: 0, y: 10 - 0.001, z: 0 };

		// need to test these vals
		case 'left':
			return { x: 0, y: 0, z: 10 - 0.001 };
		case 'bottom':
			return { x: 0, y: -10 + 0.001, z: 0 };
	}
};

const getFaceRot = (face) => {
	switch (face) {
		case 'front':
			return { x: 0, y: -Math.PI / 2, z: 0 };
		case 'right':
			return { x: 0, y: -Math.PI, z: 0 };
		case 'back':
			return { x: 0, y: Math.PI / 2, z: 0 };
		case 'top':
			return { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 };

		// need to test these vals
		case 'left':
			return { x: 0, y: 0, z: 0 };
		case 'bottom':
			return { x: Math.PI / 2, y: 0, z: Math.PI / 2 };
	}
};

class GreenScreenSystem extends Component {
	constructor(props) {
		super(props);
		// alert(props.roomId);
		this.scene = this.props.scene || this.props.sceneRef.current;
		this.srcs = this.props.srcs;
		this.similarity = this.props.similarity;
		this.smoothness = this.props.smoothness;
		this.spill = this.props.spill;
		this.keyColor = this.props.keyColor;

		this.positions = [
			//front
			{ x: -10 + 0.001, y: 0, z: 0 },
			//right
			{ x: 0, y: 0, z: -10 + 0.001 },
			//back
			{ x: 10 - 0.001, y: 0, z: 0 },
			//top
			{ x: 0, y: 10 - 0.001, z: 0 },

			//need to test these vals
			//left
			{ x: 0, y: 0, z: 10 - 0.001 },
			//bottom
			{ x: 0, y: -10 + 0.001, z: 0 },
		];

		this.rotations = [
			{ x: 0, y: -Math.PI / 2, z: 0 },
			{ x: 0, y: -Math.PI, z: 0 },
			{ x: 0, y: Math.PI / 2, z: 0 },
			{ x: -Math.PI / 2, y: 0, z: -Math.PI / 2 },

			//need to test these vals
			{ x: 0, y: 0, z: 0 },
			{ x: Math.PI / 2, y: 0, z: Math.PI / 2 },
		];
	}
	componentDidMount() {
		// once they are all true, the videos get placed in the scene
		this.loadedVidsFlags = [];

		this.loadedVidsFlags = this.srcs.map((src) => {
			let face = Object.keys(src)[0];
			if (src[face]) {
				return false;
			}
			return true;
		});

		this.meshes = this.srcs.map((src, indx) => {
			if (Object.keys(src)[0]) {
				let faceName = Object.keys(src)[0];
				let pos = getFacePos(faceName);
				let rot = getFaceRot(faceName);
				return GreenScreenedVid(
					null,
					pos,
					rot,
					this.keyColor,
					this.similarity,
					this.smoothness,
					this.spill,
				);
			} else {
				return null;
			}
		});

		this.vids = [null, null, null, null, null, null];
		for (var i = 0; i < 6; i++) {
			let src = this.srcs[i];
			let face = Object.keys(src)[0];
			let vidSrc = src[face];
			if (vidSrc) {
				this.vids[i] = this.createVidDom(vidSrc, this.meshes[i]);
				this.vids[i].play();
			}
		}
	}

	createVidDom = (src, vidMesh) => {
		var video = document.createElement('video');

		video.addEventListener('loadeddata', () => {
			if (DEBUG) {
				createDatGui(vidMesh, Math.random());
				window.vidMesh = vidMesh;
			}
			vidMesh.renderOrder = 2;
			this.scene.add(vidMesh);
		});

		video.src = src;
		video.setAttribute('webkit-playsinline', '');
		video.crossOrigin = 'anonymous';
		video.setAttribute('playsinline', '');
		video.setAttribute('loop', 'loop');
		// video.setAttribute('autoplay', 'true');
		video.muted = true;
		var texture = new THREE.VideoTexture(video);
		vidMesh.material.uniforms.tex.value = texture;
		return video;
	};

	componentWillUnmount() {
		this.meshes.forEach((mesh) => {
			if (mesh) {
				this.scene.remove(mesh);
				mesh.material.map = null;
				mesh.material.dispose();
				mesh.geometry.dispose();
			}
		});

		this.vids.forEach((domVid) => {
			if (domVid) {
				domVid.pause();
				// domVid.empty();
				// domVid.load();
				// delete domVid;
				domVid.remove();
			}
		});
	}

	render() {
		return <div></div>;
	}
}

export default GreenScreenSystem;
