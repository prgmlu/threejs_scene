import * as THREE from 'three';
import React, { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { isMobile } from 'react-device-detect';

const DRACO_LOADER_PATH = 'https://cdn.obsess-vr.com/draco-loader/gltf/';
const CB_MATERIAL_COUNT = isMobile ? 96 : 384;

const InteractiveGLBComponent = ({ sceneRef, hotspotData, onMouseUp }) => {
	if (!hotspotData.props.data.envMaps) {
		//return if no config found
		return null;
	}

	let model, cubeBackgroundInterval;
	let camera = window.containerInstance_camera;
	let controller = window.containerInstance_controller;
	let renderer = window.containerInstance_renderer;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	const scene = sceneRef?.current;

	let target = new THREE.Vector3();
	let mouseX = 0,
		mouseY = 0;

	let clock = new THREE.Clock();
	let q1 = new THREE.Quaternion();
	let q2 = new THREE.Quaternion();

	let windowHalfX = window.innerWidth / 2;
	let windowHalfY = window.innerHeight / 2;

	let hotspots = [];
	let hotspotMouseOver = false;

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath(DRACO_LOADER_PATH);
	dracoLoader.preload();
	loader.setDRACOLoader(dracoLoader);

	const updateAllMaterials = () => {
		model.traverse((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.material instanceof THREE.MeshStandardMaterial
			) {
				child.material.envMapIntensity =
					hotspotData.props.data?.envMapIntensity;

				child.material.needsUpdate = true;
			}
		});
	};

	const onMouseMove = (event) => {
		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		document.body.style.cursor = 'default';
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(hotspots);
		hotspotMouseOver = false;
		if (intersects.length > 0) {
			document.body.style.cursor = 'pointer';
			hotspotMouseOver = true;
		}
	};

	const onTouchMove = (event) => {
		if (!event.clientX) event['clientX'] = event.changedTouches[0].clientX;
		if (!event.clientY) event['clientY'] = event.changedTouches[0].clientY;
		onMouseMove(event);
	};

	const onMousedown = (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects([model]);
		if (intersects.length > 0) controller.enabled = false;
	};

	const onTouchStart = (event) => {
		if (!event.clientX) event['clientX'] = event.touches[0].clientX;
		if (!event.clientY) event['clientY'] = event.touches[0].clientY;
		onMousedown(event);
	};

	const onMouseClick = (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(hotspots, true);
		if (intersects.length > 0) {
			const isect = intersects.find(
				(item) =>
					item?.object?.userData &&
					Object.keys(item.object.userData).length > 0,
			);
			if (isect) {
				onMouseUp(isect.object.userData);
			}
		}
	};

	const onTouchEnd = (event) => {
		if (!event.clientX) event['clientX'] = event.changedTouches[0].clientX;
		if (!event.clientY) event['clientY'] = event.changedTouches[0].clientY;
		onMouseClick(event);
	};

	const rotateObject = (object) => {
		q1.copy(object.quaternion);
		target.y =
			(-mouseY - target.y) * hotspotData?.props?.data?.moveSensitivity;
		target.z =
			-(mouseX - target.z) * hotspotData?.props?.data?.moveSensitivity;
		object.lookAt(target);
		q2.copy(object.quaternion);

		object.quaternion.slerpQuaternions(q1, q2, clock.getDelta());
	};

	const resetObject = (object) => {
		q1.copy(object.quaternion);
		target.y = 0;
		target.z = 0;
		object.lookAt(target);
		q2.copy(object.quaternion);
		object.quaternion.slerpQuaternions(q1, q2, clock.getDelta());
	};

	const animate = () => {
		requestAnimationFrame(animate);
		if (controller.enabled === false && hotspotMouseOver === false) {
			rotateObject(model);
			return;
		}
		resetObject(model);
	};

	const addHotspots = () => {
		hotspotData.props.data.hotspots.forEach((hotspot) => {
			const svgLoader = new SVGLoader();
			svgLoader.load(hotspot.props.icon.path, (data) => {
				const paths = data.paths;
				const group = new THREE.Group();

				const shapes = paths.map((path) =>
					SVGLoader.createShapes(path),
				);

				shapes.forEach((shape, ix) => {
					const path = paths[ix];
					const material = new THREE.MeshBasicMaterial({
						color: path.color,
						side: THREE.DoubleSide,
						depthWrite: false,
						toneMapped: false,
						transparent: true,
						opacity: path?.userData?.style?.fillOpacity,
					});
					const geometry = new THREE.ShapeGeometry(shape);
					const mesh = new THREE.Mesh(geometry, material);
					mesh.userData = hotspot.props;
					mesh.name = 'hotspotShapeMesh';
					group.add(mesh);
				});

				group.position.set(
					hotspot.transform.position.x,
					hotspot.transform.position.y,
					hotspot.transform.position.z,
				);
				group.rotation.set(
					hotspot.transform.rotation.x,
					hotspot.transform.rotation.y,
					hotspot.transform.rotation.z,
				);
				group.scale.set(
					hotspot.transform.scale.x,
					hotspot.transform.scale.y,
					hotspot.transform.scale.z,
				);

				hotspots.push(group);
				model.add(group);
			});
		});
	};

	const revertSceneMaterialToNormal = () => {
		scene.children.forEach((child) => {
			if (child.name === 'cubeBackground') {
				child.children.forEach((child2) => {
					child2.material.forEach((material) => {
						material.transparent = true;
						material.depthTest = false;
						material.depthWrite = false;
						material.toneMapped = true;
						material.needsUpdate = true;
					});
				});
			}
		});
	};

	const resetRendererToNormal = () => {
		//TODO: use threejs values, example, THREE.sRGBEncoding instead of below numbers
		renderer.toneMapping = 0;
	};

	const removeEventListeners = () => {
		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mousedown', onMousedown, false);
		document.removeEventListener('click', onMouseClick, false);
		document.removeEventListener('touchstart', onTouchStart, false);
		document.removeEventListener('touchend', onTouchEnd, false);
		document.removeEventListener('touchmove', onTouchMove, false);
	};

	const onComponentUmount = () => {
		scene.remove(model);
		revertSceneMaterialToNormal();
		resetRendererToNormal();
		removeEventListeners();
	};

	const prepareSceneForGLTFObject = (cubeBackground) => {
		cubeBackground.children.forEach((child) => {
			child.material.forEach((material) => {
				material.transparent = false;
				material.depthTest = true;
				material.depthWrite = true;
				material.toneMapped = false;
				material.needsUpdate = true;
			});
		});
	};

	const prepareRendererForGLTF = () => {
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
	};

	useEffect(() => {
		const cubeTextureLoader = new THREE.CubeTextureLoader();

		Promise.all([
			cubeTextureLoader.loadAsync([
				hotspotData.props.data.envMaps.px,
				hotspotData.props.data.envMaps.nx,
				hotspotData.props.data.envMaps.py,
				hotspotData.props.data.envMaps.ny,
				hotspotData.props.data.envMaps.pz,
				hotspotData.props.data.envMaps.nz,
			]),
			loader.loadAsync(hotspotData.props.data.glbObjectUrl), //glb
		])
			.then((results) => {
				const cubeBackground = scene.children.find(
					(child) => child.name === 'cubeBackground',
				);

				if (cubeBackground) {
					while (cubeBackground.children.length !== 6) {}
					cubeBackgroundInterval = setInterval(() => {
						const materialCount = cubeBackground.children
							.map((child) => child.material.length)
							.reduce((partial, a) => partial + a, 0);

						if (materialCount === CB_MATERIAL_COUNT) {
							prepareSceneForGLTFObject(cubeBackground);
							prepareRendererForGLTF();
							clearInterval(cubeBackgroundInterval);
						}
					}, 100);
				}

				const [environmentMap, gltf] = results;
				environmentMap.encoding = THREE.sRGBEncoding;
				scene.environment = environmentMap;

				model = gltf.scene; //glb

				addHotspots();

				model.position.set(
					hotspotData.props.data.objectTransform.position.x,
					hotspotData.props.data.objectTransform.position.y,
					hotspotData.props.data.objectTransform.position.z,
				);
				model.rotation.set(
					hotspotData.props.data.objectTransform.rotation.x,
					hotspotData.props.data.objectTransform.rotation.y,
					hotspotData.props.data.objectTransform.rotation.z,
				);
				model.scale.set(
					hotspotData.props.data.objectTransform.scale.x,
					hotspotData.props.data.objectTransform.scale.y,
					hotspotData.props.data.objectTransform.scale.z,
				);
				scene.add(model);
				updateAllMaterials();
				animate();
			})
			.catch((error) => {
				console.error(error);
			});

		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('click', onMouseClick, false);
		document.addEventListener('mousedown', onMousedown, false);
		document.addEventListener('touchstart', onTouchStart, false);
		document.addEventListener('touchend', onTouchEnd, false);
		document.addEventListener('touchmove', onTouchMove, false);

		return () => {
			onComponentUmount();
		};
	}, []);

	return null;
};

export default InteractiveGLBComponent;