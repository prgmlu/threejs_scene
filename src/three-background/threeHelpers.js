import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export const createScene = () => {
    var scene = new THREE.Scene();
    return scene;
};

export const createRenderer = (canvas=null) => {

	if(canvas){
		var renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvas,
			
			// alpha: true,
			// preserveDrawingBuffer: true,
		});
	}
	else{
		var renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		
	}

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xffcaca, 0);
	renderer.domElement.style.touchAction = 'none';



	renderer.shadowMap.enabled = false
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 1
	renderer.shadowMap.enabled = THREE.PCFSoftShadowMap



    return renderer
};



export const adjustRenderer = (renderer) => {

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.shadowMap.enabled = false
	renderer.shadowMap.type = THREE.PCFSoftShadowMap

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 1
	renderer.shadowMap.enabled = THREE.PCFSoftShadowMap

    return renderer
};

export const resetRenderer = (renderer) => {

    renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = 3000;

	renderer.shadowMap.enabled = false
	renderer.shadowMap.type = THREE.PCFSoftShadowMap

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.toneMapping = 0;
	renderer.shadowMap.enabled = THREE.PCFSoftShadowMap
}


export const loadModelAndAnimations = async () => {
	return new Promise((resolve, reject) => {
		let loader = new GLTFLoader();
		loader.crossOrigin = true;
		loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/mixamoriggedopaque.glb", (data) => {
			loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/animations.glb", (anims) => {
				let animations = anims.animations
				const model = data.scene;
				// const model = createCube();

				window.model = model;

				const charAnimations = animations;
				const mixer = new THREE.AnimationMixer(model);
				const animationsMap = new Map();
				charAnimations.filter(a => a.name != 'T-Pose').forEach((a) => {
					animationsMap.set(a.name, mixer.clipAction(a));
				});
				let initModelPos = [0, 0.1,3 ];
				model.position.set(...initModelPos);
				model.scale.set(1.2, 1.2, 1.2);

				resolve([model, mixer, animationsMap]);
				// this.scene.add(model);

			});
		});
	});
}


export const setUpNormalLights = (scene) => {

	
	const light = new THREE.SpotLight(0xffffff, 0.8);
	light.angle = Math.PI / 3;
	light.position.set(0, 10, 0);
	scene.add(light);
	scene.add(new THREE.AmbientLight(0xffffff, 0.7));
}

export const setUpEnvMap = (scene, renderer) => {
	const cubeTextureLoader = new THREE.CubeTextureLoader()
	const environmentMap = cubeTextureLoader.load([
		"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/px.jpg",
		"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/nx.jpg",
		"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/py.jpg",
		"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/ny.jpg",
		"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/pz.jpg",
		"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/nz.jpg",
	])
	
	environmentMap.encoding = THREE.sRGBEncoding
	scene.environment = environmentMap

}


export const setUpSceneBackground = (scene) => {
	const cubeTextureLoader = new THREE.CubeTextureLoader()

	const backgroundMap = cubeTextureLoader.load([
        "https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/px.jpg",
        "https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/nx.jpg",
        "https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/py.jpg",
        "https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/ny.jpg",
        "https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/pz.jpg",
        "https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/nz.jpg",
	], (tex)=>{

        tex.encoding = THREE.sRGBEncoding
        scene.background = tex
    })
	

	// let texLoader = new THREE.TextureLoader();
	// var tex = texLoader.load('https://cdn.obsess-vr.com/lululemon/fish.jpeg');
	// scene.background = tex;
}



export const createBoundingObj = (position) => {
    const objGeometry = new THREE.SphereGeometry( 1, 32, 32);
    const objMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0});
    const boundingObj = new THREE.Mesh(objGeometry, objMaterial);
	boundingObj.position.set(position.x, position.y, position.z);
    return boundingObj
}

export const createOrbitControls = (camera, renderer, minDist=2, maxDist=5, enablePan=false,maxPolarAngle=Math.PI / 2 - 0.05 ) => {
	let orbitControls;
	orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.minDistance = minDist;
	orbitControls.maxDistance = maxDist;
	orbitControls.enablePan = enablePan;
	orbitControls.maxPolarAngle = maxPolarAngle;
	return orbitControls;
}