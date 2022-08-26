import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';

const InSceneImageComponent = (props) => {
	const { src, transform, sceneRef } = props;

	const scene = sceneRef?.current;
	let imageMeshRef = useRef(null);

	const setTransform = () => {
		const transformMatrix = new THREE.Matrix4();
		transformMatrix.elements = transform;
		transformMatrix.decompose(
			imageMeshRef.current.position,
			imageMeshRef.current.quaternion,
			imageMeshRef.current.scale,
		);
	};

	const addToScene = () => {
		scene.add(imageMeshRef.current);
	};

	const setupImageMesh = () => {
		const geometry = new THREE.PlaneGeometry(1, 1);

		const loader = new THREE.TextureLoader();
		loader.crossOrigin = '';

		let texture = loader.load(src);
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;

		let material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide,
		});
		imageMeshRef.current = new THREE.Mesh(geometry, material);
		imageMeshRef.current.renderOrder = 2;
	};

	const onComponentUmount = () => {
		scene.remove(imageMeshRef.current);

		if (imageMeshRef.current.material) {
			imageMeshRef.current.material.map = null;
			imageMeshRef.current.material.dispose();
			imageMeshRef.current.geometry.dispose();
		}
	};

	useEffect(() => {
		setupImageMesh();
		setTransform();
		addToScene();
		return () => {
			onComponentUmount();
		};
	}, [scene]);

	return null;
};

export default InSceneImageComponent;
