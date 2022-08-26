import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default class GLB_object extends THREE.Group {
	constructor({ url, is_animation_on, onModelLoaded }) {
		super();
		this.glbData = null;
		this.model = null;
		this.animations = null;
		this.onModelLoaded = onModelLoaded;
		this.clock = new THREE.Clock();
		this.config = { url, is_animation_on };

		//Loader
		this.loader = new GLTFLoader();
		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath(
			'https://www.gstatic.com/draco/v1/decoders/',
		);
		this.loader.setDRACOLoader(this.dracoLoader);

		if (url) this.loadModel(url);
	}

	updateConfig = (newConfig) => {
		console.log('%c GLB update ', 'color:blue', { newConfig });
		if (newConfig.url !== this.config.url) this.loadModel(newConfig.url);
	};

	loadModel = async (url) => {
		if (!url) return;
		const glbData = await this.loader.loadAsync(url);
		this.glbData = glbData;

		console.log('%c LOAD modelData ', 'color:blue', { glbData });
		this.animations = glbData.scene.animations;
		this.castShadow = glbData.scene.castShadow;
		this.asset = glbData.scene.asset;
		this.children = glbData.scene.children;
		// glbData.scene?.children?.traverse((child) => { this.add(child)  })
		// glbData.scene.children.map(item=>{ this.add(item) });
		this.frustumCulled = glbData.scene.frustumCulled;
		this.layers = glbData.scene.layers;
		this.matrix = glbData.scene.matrix;
		this.matrixAutoUpdate = glbData.scene.matrixAutoUpdate;
		this.matrixWorld = glbData.scene.matrixWorld;
		this.matrixWorldNeedsUpdate = glbData.scene.matrixWorldNeedsUpdate;
		this.name = glbData.scene.name;
		this.parent = glbData.scene.parent;
		this.receiveShadow = glbData.scene.receiveShadow;
		this.renderOrder = glbData.scene.renderOrder;
		// this.add(glbData.scene)
		// this.updateMatrixWorld(true);

		if (this.glbData?.animations?.length > 0) this.handleAnimationLogic();
		// else this.animations = false;
		this.onModelLoaded && this.onModelLoaded();
		// const boxHelper = new THREE.BoxHelper(this, 0x101010); //same as BoundingBoxHelper
		// boxHelper.update();
		// this.add(boxHelper);
	};

	// reScaleToFitObject=(targetObject)=>{
	// 	// console.log('%c reScaleToFitObject ', 'color:blue', { targetObject, 'this':this });
	// 	const glb_Bounds = getObjectBoxSize(this.glbData.scene);
	// 	const target_Bounds = getObjectBoxSize(targetObject);
	// 	const aspect = target_Bounds.largerSide * targetObject.scale.x/ (glb_Bounds.largerSide * this.scale.x);
	//
	//
	// 	console.log('%c reScaleToFitObject ', 'color:blue', {   aspect, glb_Bounds, target_Bounds,targetObject, 'this':this,  });
	// 	if(glb_Bounds.largerSide > target_Bounds.largerSide){
	// 	}
	// }

	handleAnimationLogic() {
		const animations = this.glbData.animations;
		this.currentAnimation = animations[0];
		this.mixer = new THREE.AnimationMixer(this);

		if (this.config.is_animation_on) this.startAnimation();

		this.animate();
	}

	startAnimation = () => {
		if (this.animations)
			this.mixer.clipAction(this.currentAnimation).play();
	};

	stopAnimation = () => {
		if (this.animations)
			this.mixer.clipAction(this.currentAnimation).stop();
	};

	animateGLB() {
		this.animations = this.glbData.animations;
		this.currentAnimation = this.animations[0];
		this.mixer = new THREE.AnimationMixer(this.model);

		if (this.config.is_animation_on) this.startAnimation();

		this.animate();
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		const delta = this.clock.getDelta();
		this.mixer.update(delta);
	};
}
