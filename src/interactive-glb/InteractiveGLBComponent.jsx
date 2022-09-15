import * as THREE from 'three';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import TWEEN from '@tweenjs/tween.js';

const InteractiveGLBComponent = ({
	sceneRef,
	hotspotData,
	onMouseUp,
	onClick,
}) => {
	if (!hotspotData.props.data.envMaps) {
		//return if no config found
		return null;
	}

	let model;
	let camera = window.containerInstance_camera;
	const cameraPos = camera.position.clone();
	let controller = window.containerInstance_controller;
	let renderer = window.containerInstance_renderer;

	let mixer = null;
	let isObjectReset = false;
	let yQuaternionDifference = 0.0;
	let zQuaternionDifference = 0.0;

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

	const svgLoader = new SVGLoader();
	const loader = new GLTFLoader();

	let directionalLight, pointLight;

	const cubeTextureLoader = new THREE.CubeTextureLoader();
	THREE.Cache.enabled = true;
	const updateAllMaterials = () => {
		model.traverse((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.material instanceof THREE.MeshStandardMaterial
			) {
				child.material.envMapIntensity =
					hotspotData.props.data?.envMapIntensity;
			}
		});
	};

	const addLights = () => {
		if (hotspotData?.props?.data?.directionalLight) {
			directionalLight = new THREE.DirectionalLight(
				hotspotData.props.data.directionalLight.color,
				hotspotData.props.data.directionalLight.intensity,
			);
			directionalLight.position.set(
				hotspotData.props.data.directionalLight.transform.position.x,
				hotspotData.props.data.directionalLight.transform.position.y,
				hotspotData.props.data.directionalLight.transform.position.z,
			);
			directionalLight.rotation.set(
				hotspotData.props.data.directionalLight.transform.rotation.x,
				hotspotData.props.data.directionalLight.transform.rotation.y,
				hotspotData.props.data.directionalLight.transform.rotation.z,
			);
			scene.add(pointLight);
		}

		if (hotspotData?.props?.data?.pointLight) {
			pointLight = new THREE.PointLight(
				hotspotData.props.data.pointLight.color,
				hotspotData.props.data.pointLight.intensity,
			);
			pointLight.position.set(
				hotspotData.props.data.pointLight.transform.position.x,
				hotspotData.props.data.pointLight.transform.position.y,
				hotspotData.props.data.pointLight.transform.position.z,
			);
			scene.add(directionalLight);
		}
	};

	const removeLights = () => {
		if (directionalLight) {
			scene.remove(directionalLight);
		}
		if (pointLight) {
			scene.remove(pointLight);
		}
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
		if (intersects.length > 0) {
			controller.enabled = false;
			onClick();
		}
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

	const checkObjectRotation = () => {
		//check if object is facing the camera
		yQuaternionDifference = Math.abs(q1.y - q2.y);
		zQuaternionDifference = Math.abs(q1.z - q2.z);
		if (
			yQuaternionDifference < 0.01 &&
			zQuaternionDifference < 0.01 &&
			controller.enabled === true &&
			model.rotation.y > 1.4 &&
			model.rotation.y < 1.6
		) {
			isObjectReset = true;
			return;
		}
		isObjectReset = false;
	};

	const animateGLTF = () => {
		if (
			mixer != null &&
			hotspotData.props.data.isAnimated === true &&
			controller.enabled
		)
			mixer.update(clock.getDelta());
	};

	const animate = () => {
		requestAnimationFrame(animate);
		if (hotspotData.props.data.lookAtEnabled) {
			checkObjectRotation();

			if (controller.enabled === false && hotspotMouseOver === false) {
				rotateObject(model);
				return;
			}

			if (isObjectReset === false) {
				resetObject(model);
				return;
			}
		}

		animateGLTF();
	};

	const addHotspots = () => {
		hotspotData?.props?.data?.hotspots?.forEach((hotspot) => {
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

	const resetRendererToNormal = () => {
		renderer.shadowMap.enabled = false;
		renderer.toneMapping = THREE.NoToneMapping;
		renderer.shadowMap.enabled = false;
	};

	const removeEventListeners = () => {
		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('mousedown', onMousedown, false);
		document.removeEventListener('click', onMouseClick, false);
		document.removeEventListener('touchstart', onTouchStart, false);
		document.removeEventListener('touchend', onTouchEnd, false);
		document.removeEventListener('touchmove', onTouchMove, false);
		document.removeEventListener('glb_event_hotspot', processEvent);
	};

	const onComponentUmount = () => {
		scene.remove(model);
		resetRendererToNormal();
		removeEventListeners();
		removeLights();
	};

	const prepareRendererForGLTF = () => {
		renderer.antialias = true;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
	};

	const prepareMixerForGLTF = (gltf) => {
		if (hotspotData.props.data.isAnimated === true) {
			mixer = new THREE.AnimationMixer(gltf.scene);
			const hover = mixer.clipAction(gltf.animations[0]);
			hover.loop = THREE.LoopRepeat;
			hover.play();
		}
	};

	const updateGLBColor = (data) => {
		const updateMap = {};
		data.forEach((item) => (updateMap[item.meshName] = item.color));
		model.traverse((object) => {
			if (object.isMesh) {
				const name = object.name;
				if (name in updateMap) {
					const updateTo = updateMap[name];
					object.material.color.set(
						new THREE.Color(
							`rgb(${updateTo.r}, ${updateTo.g}, ${updateTo.b})`,
						),
					);
					object.material.needsUpdate = true;
				}
			}
		});
	};

	const getSceneCenterPos = () => {
		const position = new THREE.Vector3(0, 0, -10);
		position.applyQuaternion(camera.quaternion);
		return position;
	};

	const rotateCameraTowardsModel = (marker) => {
		camera.rotation.reorder('YXZ');
		// calculate time taken to move from the center to marker position.
		const speed = 5;
		const centerPosition = getSceneCenterPos();
		const distanceFromCenter = Math.sqrt(
			(marker.position.x - centerPosition.x) *
				(marker.position.x - centerPosition.x) +
				(marker.position.y - centerPosition.y) *
					(marker.position.y - centerPosition.y) +
				(marker.position.z - centerPosition.z) *
					(marker.position.z - centerPosition.z),
		);

		// time in milliseconds.
		const time = (distanceFromCenter / speed) * 500;

		const distance = new THREE.Vector3()
			.subVectors(camera.position, controller.target)
			.length();
		const storedMarkerPosition = new THREE.Vector3(
			marker.position.x,
			marker.position.y,
			marker.position.z,
		);
		const startRotation = new THREE.Euler().copy(camera.rotation);
		camera.lookAt(storedMarkerPosition);
		const endRotation = new THREE.Euler().copy(camera.rotation);
		camera.rotation.copy(startRotation);

		new TWEEN.Tween(camera.rotation)
			.to(
				{
					x: endRotation.x,
					y: endRotation.y,
					z: endRotation.z,
				},
				time,
			)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(() => {
				camera.updateProjectionMatrix();
			})
			.onComplete(() => {
				const normal = new THREE.Vector3(0, 0, -1).applyEuler(
					camera.rotation,
				);
				controller.target = new THREE.Vector3()
					.add(camera.position)
					.add(normal.setLength(distance));
			})
			.start();
	};

	const resetCameraPosition = () => {
		camera.position.x = cameraPos.x;
		camera.position.y = cameraPos.y;
		camera.position.z = cameraPos.z;
	};

	const modelNotInFocus = () => {
		// Check if model is visibile or within camera's field of view (FOV)
		const frustum = new THREE.Frustum();
		const matrix = new THREE.Matrix4().multiplyMatrices(
			camera.projectionMatrix,
			camera.matrixWorldInverse,
		);
		frustum.setFromProjectionMatrix(matrix);
		return !frustum.containsPoint(model.position);
	};

	const processEvent = (e) => {
		const eventName = e?.detail?.eventName;
		switch (eventName) {
			case 'GLB_UPDATE_COLOR':
				updateGLBColor(e?.detail?.apply);
				if (modelNotInFocus()) {
					rotateCameraTowardsModel(model);
					resetCameraPosition();
				}
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		prepareRendererForGLTF();
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
				const [environmentMap, gltf] = results;
				environmentMap.encoding = THREE.sRGBEncoding;
				scene.environment = environmentMap;
				model = gltf.scene; //glb

				addLights();
				prepareMixerForGLTF(gltf);
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
		document.addEventListener('glb_event_hotspot', processEvent);

		return () => {
			onComponentUmount();
		};
	}, []);

	return null;
};

export default InteractiveGLBComponent;
