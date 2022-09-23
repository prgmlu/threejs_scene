import * as THREE from 'three';
import InteractionObject from './InteractionObject';
import GLB_object from '../../Components/GLBobject';

export default class Object3dMarker extends InteractionObject {
	constructor({
		transform,
		collider_transform,
		imageURL,
		visualObjectConf = {},
		renderOrder,
		scale,
		userData,
		look_at_camera,
		UIConfig,
		boxColliderConfig,
		camera,
		...rest
	}) {
		super({
			transform,
			collider_transform,
			boxColliderConfig: { ...boxColliderConfig, depth: 1 },
			UIConfig,
			userData,
			camera,
		});

		this.markerType = '3d_model_marker'; //type of marker
		this.url = visualObjectConf.url;

		// init VisualObject
		const glbModel = new GLB_object({
			url: visualObjectConf.url,
			is_animation_on: visualObjectConf?.is_animation_on,
		});
		this.setVisualObject(glbModel);
		this.visualObject.owner = this;
	}

	updateVisualObjectConf = (visualObjectConf) => {
		this.visualObject.updateConfig(visualObjectConf);
	};

	startAnimation = () => this.visualObject.startAnimation();
	stopAnimation = () => this.visualObject.stopAnimation();

	addLights(scene) {
		if (!scene.getObjectByName('3d-obj-marker-ambient-light')) {
			this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
			this.directionalLight.name = '3d-obj-marker-directional-light';
			scene.add(this.directionalLight);
		}
	}

	addToScene = async (scene) => {
		this.scene = scene;
		// this.addLights(this.scene);

		//Existing record. Set transforms (scale, position, rotation) if provided
		if (this.transform && this.collider_transform)
			this.setTransform(this.collider_transform, this.transform);
		//new record
		else {
			//TODO: user can move camera! Look how VideoHotspots implemented
			let centerPos = this.getSceneCenterPos();
			this.setPosition(centerPos.x, centerPos.y, centerPos.z);
			this.rotateObjectToCamera();
		}

		this.scene.add(this.sceneObject);
		this.scene.add(this.visualObject);
	};

	dispose() {
		if (this?.directionalLight?.dispose) {
			this.directionalLight.dispose();
			this.scene.remove(this.directionalLight);
			this.directionalLight = null;
		}

		this.scene.remove(this.visualObject);
		this.scene.remove(this.sceneObject);
		super.dispose();

		this.setVisualObject(null);
		this.sceneObject = null;
	}
}
