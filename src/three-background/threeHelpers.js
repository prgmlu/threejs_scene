import * as THREE from 'three';
import {
	OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
	GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
import {
	FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader';

import { dressUpFromString } from '../three-controls/CharacterControls/OutfitTranslator.js';

import { DRACOLoader } from './RealtimeBackground/DRACOLoader.js';

import { GUI } from 'dat.gui';
import {USE_OLD_CHARACTER_MODEL, SHADOW_MAP_TYPE, SHADOW_ENABLED} from './RealtimeBackground/avatar-creator/CustomizationConstants.js';


let USE_OUTFIT_TRANSLATION = true;


const DEBUG_LIGHTS = false;
const DEBUG_LIGHTS_AVTAR_EDITOR = false;

let gui;
if(DEBUG_LIGHTS || DEBUG_LIGHTS_AVTAR_EDITOR){
	var guiDiv = document.createElement('div');
	guiDiv.style.zIndex = 99;
	guiDiv.style.position = 'fixed';
	guiDiv.style.top = '0px';
	var bod = document.getElementsByTagName('body')[0];
	bod.appendChild(guiDiv);
	
	gui = new GUI({autoPlace:false});
	// gui.close();
	// var cont = document.getElementById('datgui');
	guiDiv.appendChild(gui.domElement);
	const folder = gui.addFolder('folder');
}


export const hideAllExceptFirstClothItem = (model) => {
	let hairs = []
	let pants = []
	let shirts = []
	let shoes = []
	let glasses = []

	model.traverse((i)=>{
		if(i.name.includes('Hair')){
			hairs.push(i);
			i.visible=false;
		}

		if(i.name.includes('Glasses')){
			glasses.push(i);
			i.visible=false;
		}

		if(i.name.includes('Shoes')){
			shoes.push(i);
			i.visible=false;
		}

		if(i.name.includes('Pants')){
			pants.push(i);
			i.visible=false;
		}

		if(i.name.includes('Shirt')){
			shirts.push(i);
			i.visible=false;
		}

	});

	var choice = Math.floor(Math.random() * hairs.length);
	if(hairs[choice])
		hairs[choice].visible=true;
	// choice = Math.floor(Math.random() * glasses.length);
	// if(glasses[choice])
	// 	glasses[choice].visible=true;
	choice = Math.floor(Math.random() * shoes.length);
	if(shoes[choice])
		shoes[choice].visible=true;
	choice = Math.floor(Math.random() * pants.length);
	if(pants[choice])
		pants[choice].visible=true;
	choice = Math.floor(Math.random() * shirts.length);
	if(shirts[choice])
		shirts[choice].visible=true;
}


let useArmani = false;
// const MODEL_SCALE = [1.2,1.2,1.2];
const MODEL_SCALE = [1, 1, 1];


// let useCt = true;

// const envMapArr = useArmani ? [
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/px.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/nx.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/py.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/ny.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/pz.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/armani/nz.jpg",
// ] : [
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_envmap/px.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_envmap/nx.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_envmap/py.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_envmap/ny.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_envmap/pz.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_envmap/nz.jpg",
// ]

const envMapArr = [
	"https://cdn.obsess-vr.com/realtime3d/envmap-footprint/px.jpg",
	"https://cdn.obsess-vr.com/realtime3d/envmap-footprint/nx.jpg",
	"https://cdn.obsess-vr.com/realtime3d/envmap-footprint/py.jpg",
	"https://cdn.obsess-vr.com/realtime3d/envmap-footprint/ny.jpg",
	"https://cdn.obsess-vr.com/realtime3d/envmap-footprint/pz.jpg",
	"https://cdn.obsess-vr.com/realtime3d/envmap-footprint/nz.jpg",
]

const bgArray = useArmani ? [
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/px.jpg",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/nx.jpg",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/py.jpg",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/ny.jpg",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/pz.jpg",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/nz.jpg",
] : [
	"https://cdn.obsess-vr.com/realtime3d/purple_night_sky/px.png",
	"https://cdn.obsess-vr.com/realtime3d/purple_night_sky/nx.png",
	"https://cdn.obsess-vr.com/realtime3d/purple_night_sky/py.png",
	"https://cdn.obsess-vr.com/realtime3d/purple_night_sky/ny.png",
	"https://cdn.obsess-vr.com/realtime3d/purple_night_sky/pz.png",
	"https://cdn.obsess-vr.com/realtime3d/purple_night_sky/nz.png",
]
// const bgArray = useArmani ? [
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/px.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/nx.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/py.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/ny.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/pz.jpg",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/bluesky/nz.jpg",
// ] : [
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/px.png",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/nx.png",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/py.png",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/ny.png",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/pz.png",
// 	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/nz.png",
// ]

export const createScene = () => {
	var scene = new THREE.Scene();
	return scene;
};

export const createRenderer = (canvas = null) => {

	if (canvas) {
		var renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvas,

			// alpha: true,
			// preserveDrawingBuffer: true,
		});
	} else {
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



	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = SHADOW_MAP_TYPE;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 1



	return renderer
};



export const adjustRenderer = (renderer) => {

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;

	// renderer.shadowMap.enabled = SHADOW_ENABLED;
	// renderer.shadowMap.type = SHADOW_MAP_TYPE;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 1

	return renderer
};

export const resetRenderer = (renderer) => {

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = 3000;

	renderer.shadowMap.enabled = false
	// renderer.shadowMap.type = SHADOW_MAP_TYPE;

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.toneMapping = 0;
}


export const loadModelAndAnimations = async (url,outfitString, frustumCulled=false) => {
	return new Promise((resolve, reject) => {
		let loader = new GLTFLoader();
        let dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
            'https://cdn.obsess-vr.com/charlotte-tilbury/gltf/',
        );
        loader.setDRACOLoader(dracoLoader);
		loader.crossOrigin = true;
			loader.load(url, (data) => {
			let animations = data.animations;
			const model = data.scene;

			if(!frustumCulled){
				model.traverse((i) => {
					// i.castShadow = true;
					i.frustumCulled = false;
					// i.receiveShadow = true;
				})
			}
			window.model = model;

			if(outfitString.current && USE_OUTFIT_TRANSLATION){
				dressUpFromString(model,outfitString.current)
			}
			else{
				hideAllExceptFirstClothItem(model)
			}

			try{
				// model.getObjectByName("Eyebrow1").visible = true;
	
				// model.getObjectByName("Eye1").material.color.set('black');
				// model.getObjectByName("Eye1").material.needsUpdate = true;
	
				// // model.getObjectByName("Eyebrow1").material.color.set('black');
				// model.getObjectByName("Eyebrow1").material.needsUpdate = true;
			}
			catch(e){
				console.log(e)
			}
			let hairNames = [
				'Hair1',
				'Hair2',
				'Hair3',
				'Hair4',
				'Hair5',
			]
			try{
				// hairNames.forEach((name)=>{
				// 	model.getObjectByName(name).material.color.set('black');
				// 	model.getObjectByName(name).material.needsUpdate = true;
				// })
			}
			catch(e){
				console.log(e)
			}


			const charAnimations = animations;

			const mixer = new THREE.AnimationMixer(model);
			const animationsMap = new Map();
			charAnimations.filter(a => a.name != 'T-Pose').forEach((a) => {
				animationsMap.set(a.name, mixer.clipAction(a));
			});
			// let initModelPos = [0, .1,5 ];
			// model.position.set(...initModelPos);

			model.position.set(2,0,2)

			model.scale.set(...MODEL_SCALE);

			resolve([model, mixer, animationsMap]);
			console.log("loaded model")
			// this.scene.add(model);

			// });
		});
	});
}


let createBoundingBoxFromBoundingBoxes = (boxesArray) =>{
	let box = new THREE.Box3();
	boxesArray.forEach(b => box.expandByObject(b));
	return box;

}

let coverGlbWithBoxes = (glb, scene) => {
	let bigBox = new THREE.Box3();

	glb.traverse((child) => {
		if (!child.isMesh) return;

		let box3 = new THREE.Box3();
		box3.setFromObject(child);
		bigBox.expandByObject(child);
	})

	let dimensions = new THREE.Vector3().subVectors(bigBox.max, bigBox.min);
	let boxDummyGeo = new THREE.BoxBufferGeometry();
	let matrix = new THREE.Matrix4().setPosition(
		new THREE.Vector3().addVectors(bigBox.min, bigBox.max).multiplyScalar(0.5)
		);
		
		let mesh = new THREE.Mesh(
			boxDummyGeo,
			new THREE.MeshBasicMaterial({
				color: 0x00ff00, transparent: true, opacity: .5
			})

			);
			mesh.applyMatrix(matrix);
			mesh.matrixWorldNeedsUpdate = true;
		mesh.scale.set(...dimensions.toArray());

		scene.add(mesh);
}





export const setUpNormalLights = (scene, avatarEditor) => {
	if(avatarEditor){
		const spotLight_001 = new THREE.SpotLight(0xFFFFFF, 5);
		scene.add(spotLight_001);
		spotLight_001.position.set(1,4,3);
		spotLight_001.target.position.x = -0.5;
		spotLight_001.target.position.y = 0;
		spotLight_001.target.position.z = 0.5;
		scene.add(spotLight_001.target);
		spotLight_001.penumbra = 1;
		const spotLight_001_helper = new THREE.SpotLightHelper(spotLight_001);

		// scene.add(spotLight_001_helper);

		if(DEBUG_LIGHTS_AVTAR_EDITOR){
			gui.add(spotLight_001, 'intensity').min(0).max(10).step(0.01).name('spot intensity')
			gui.add(spotLight_001.position, 'x').min(0).max(10).step(0.01).name('spot position x')
			gui.add(spotLight_001.position, 'y').min(0).max(10).step(0.01).name('spot position y')
			gui.add(spotLight_001.position, 'z').min(0).max(10).step(0.01).name('spot position z')
		}

		const pntLight_001 = new THREE.PointLight(0xFFF1BF, 0.75);
		scene.add(pntLight_001);
		pntLight_001.position.set(0.5,1.5,2);
		const pntLight_001_helper = new THREE.PointLightHelper(pntLight_001, 0.5);

		// scene.add(pntLight_001_helper);

		if(DEBUG_LIGHTS_AVTAR_EDITOR){
			gui.add(pntLight_001, 'intensity').min(0).max(10).step(0.01).name('pnt 1  intensity');
			gui.add(pntLight_001.position, 'x').min(0).max(10).step(0.01).name('pnt 1 position x');
			gui.add(pntLight_001.position, 'y').min(0).max(10).step(0.01).name('pnt 1 position y');
			gui.add(pntLight_001.position, 'z').min(0).max(10).step(0.01).name('pnt 1 position z');
		}

		const pntLight_002 = new THREE.PointLight(0xFFF1BF, 0.25);
		scene.add(pntLight_002);
		pntLight_002.position.set(-1,1,2);

		if(DEBUG_LIGHTS_AVTAR_EDITOR){
			gui.add(pntLight_002, 'intensity').min(0).max(10).step(0.01).name('pnt 2  intensity');
			gui.add(pntLight_002.position, 'x').min(0).max(10).step(0.01).name('pnt 2 position x');
			gui.add(pntLight_002.position, 'y').min(0).max(10).step(0.01).name('pnt 2 position y');
			gui.add(pntLight_002.position, 'z').min(0).max(10).step(0.01).name('pnt 2 position z');
		}
		
		return;
	}
	let lights = [];

	const spotLight_001 = new THREE.SpotLight(0xffffff, 1);
	scene.add(spotLight_001);
	lights.push(spotLight_001);
	spotLight_001.position.set(2,5,2);
	spotLight_001.angle = 0.66
	spotLight_001.penumbra = 0.29;
	spotLight_001.decay = 2;
	spotLight_001.distance = 20;
	spotLight_001.target.position.set(6,0,-4)
	scene.add(spotLight_001.target);
	
	// const spotLight_001_helper = new THREE.SpotLightHelper(spotLight_001);
	// scene.add(spotLight_001_helper);
	// spotLight_001_helper.parent.updateMatrixWorld();
	// spotLight_001_helper.update();
	// gui.add(spotLight_001, 'intensity').min(0).max(10).step(0.01).name('spot_001-light-intensity');
	// gui.add(spotLight_001, 'angle').min(0).max(10).step(0.01).name('spot_001-light-angle');
	// gui.add(spotLight_001, 'penumbra').min(0).max(10).step(0.01).name('spot_001-light-penumbra');
	
	//KateLook light
	const spotLight_002 = new THREE.SpotLight(0xffffff, 1);
	scene.add(spotLight_002);
	lights.push(spotLight_002);
	spotLight_002.position.set(-5,5,-8);
	spotLight_002.angle = 0.66
	spotLight_002.penumbra = 0.29;
	spotLight_002.decay = 2;
	spotLight_002.distance = 20;
	spotLight_002.target.position.set(-5.2,0,-14)
	scene.add(spotLight_002.target);
	
	// const spotLight_002_helper = new THREE.SpotLightHelper(spotLight_002);
	// scene.add(spotLight_002_helper,0.1);
	// spotLight_002_helper.parent.updateMatrixWorld();
	// spotLight_002_helper.update();
	// gui.add(spotLight_002, 'intensity').min(0).max(10).step(0.01).name('spot_002-light-intensity');
	// gui.add(spotLight_002, 'angle').min(0).max(10).step(0.01).name('spot_002-light-angle');
	// gui.add(spotLight_002, 'penumbra').min(0).max(10).step(0.01).name('spot_002-light-penumbra');
	
	//LilyLook light
	const spotLight_003 = new THREE.SpotLight(0xffffff, 1);
	scene.add(spotLight_003);
	lights.push(spotLight_003);
	spotLight_003.position.set(0,5,-26);
	spotLight_003.angle = 0.66
	spotLight_003.penumbra = 0.29;
	spotLight_003.decay = 2;
	spotLight_003.distance = 20;
	spotLight_003.target.position.set(5,0,-32.5)
	scene.add(spotLight_003.target);
	
	// const spotLight_003_helper = new THREE.SpotLightHelper(spotLight_003);
	// scene.add(spotLight_003_helper,0.1);
	// spotLight_003_helper.parent.updateMatrixWorld();
	// spotLight_003_helper.update();
	// gui.add(spotLight_003, 'intensity').min(0).max(10).step(0.01).name('spot_003-light-intensity');
	// gui.add(spotLight_003, 'angle').min(0).max(10).step(0.01).name('spot_003-light-angle');
	// gui.add(spotLight_003, 'penumbra').min(0).max(10).step(0.01).name('spot_003-light-penumbra');
	
	//JourdanLook light
	const spotLight_004 = new THREE.SpotLight(0xffffff, 1);
	scene.add(spotLight_004);
	lights.push(spotLight_004);
	spotLight_004.position.set(-1,5,-43);
	spotLight_004.angle = 0.66
	spotLight_004.penumbra = 0.29;
	spotLight_004.decay = 2;
	spotLight_004.distance = 20;
	spotLight_004.target.position.set(-7,0,-50)
	scene.add(spotLight_004.target);
	
	// const spotLight_004_helper = new THREE.SpotLightHelper(spotLight_004);
	// scene.add(spotLight_004_helper,0.1);
	// spotLight_004_helper.parent.updateMatrixWorld();
	// spotLight_004_helper.update();
	// gui.add(spotLight_004, 'intensity').min(0).max(10).step(0.01).name('spot_004-light-intensity');
	// gui.add(spotLight_004, 'angle').min(0).max(10).step(0.01).name('spot_004-light-angle');
	// gui.add(spotLight_004, 'penumbra').min(0).max(10).step(0.01).name('spot_004-light-penumbra');
	
	//Castle light
	const spotLight_005 = new THREE.SpotLight(0xffffff, 1);
	scene.add(spotLight_005);
	lights.push(spotLight_005);
	spotLight_005.position.set(-1,5,-54);
	spotLight_005.angle = 0.66
	spotLight_005.penumbra = 0.29;
	spotLight_005.decay = 2;
	spotLight_005.distance = 20;
	spotLight_005.target.position.set(1,0,-60)
	scene.add(spotLight_005.target);
	
	// const spotLight_005_helper = new THREE.SpotLightHelper(spotLight_005);
	// scene.add(spotLight_005_helper,0.1);
	// spotLight_005_helper.parent.updateMatrixWorld();
	// spotLight_005_helper.update();
	// gui.add(spotLight_005, 'intensity').min(0).max(10).step(0.01).name('spot_005-light-intensity');
	// gui.add(spotLight_005, 'angle').min(0).max(10).step(0.01).name('spot_005-light-angle');
	// gui.add(spotLight_005, 'penumbra').min(0).max(10).step(0.01).name('spot_005-light-penumbra');
	
	//Directional lights
	//
	//
	const directLight_001 = new THREE.DirectionalLight(0x4b168c, 0.5)
	scene.add(directLight_001)
	lights.push(directLight_001)
	directLight_001.position.set(30,30,-45)
	directLight_001.target.position.set(0,0,-5)
	scene.add(directLight_001.target)
	
	// const directLight_001_helper = new THREE.DirectionalLightHelper(directLight_001)
	// scene.add(directLight_001_helper, 0.1)
	// directLight_001_helper.parent.updateMatrixWorld()
	// directLight_001_helper.update()
	// gui.add(directLight_001, 'intensity').min(0).max(10).step(0.01).name('directLight_001-intensity')
	
	const directLight_002 = new THREE.DirectionalLight(0x4b168c, 0.5)
	scene.add(directLight_002)
	lights.push(directLight_002)
	directLight_002.position.set(-30,30,-5)
	directLight_002.target.position.set(0,0,-45)
	scene.add(directLight_002.target)
	
	// const directLight_002_helper = new THREE.DirectionalLightHelper(directLight_002)
	// scene.add(directLight_002_helper, 0.1)
	// directLight_002_helper.parent.updateMatrixWorld()
	// directLight_002_helper.update()
	// gui.add(directLight_002, 'intensity').min(0).max(10).step(0.01).name('directLight_002-intensity')
	// lights.push(pntLight_001, spotLight_001, spotLight_002);

	window.lights = lights;
	
	// lights.forEach((l,i) => {
	// 	if(i!=0) return;
	// 	// l.castShadow = true;
	// 	// l.shadow.mapSize.width = 1024;
	// 	// l.shadow.mapSize.height = 1024;
	// 	// l.shadow.camera.near = .5;
	// 	// l.shadow.camera.far = 100;

	// });
}

export const setUpEnvMap = (scene, renderer) => {
	const cubeTextureLoader = new THREE.CubeTextureLoader()
	const environmentMap = cubeTextureLoader.load(envMapArr)

	environmentMap.encoding = THREE.sRGBEncoding
	scene.environment = environmentMap

}


export const setUpSceneBackground = (scene, placeHolderImage=false) => {


	if(placeHolderImage){
		const loader = new THREE.TextureLoader()
		const backgroundMap = loader.load("https://cdn.obsess-vr.com/realtime3d/placeholder_img.jpg", (tex) => {
			
			// tex.encoding = THREE.sRGBEncoding
			// tex.toneMapping = THREE.ACESFilmicToneMapping;
			// alert('setting up placeholder img')
			scene.background = tex;
			// scene.background.encoding = THREE.sRGBEncoding;

		})
	}


	else{

		const cubeTextureLoader = new THREE.CubeTextureLoader()
		const backgroundMap = cubeTextureLoader.load(bgArray, (tex) => {
			
			tex.encoding = THREE.sRGBEncoding
			// alert('setting up cube bg')
			scene.background = tex
		})
	}


	// let texLoader = new THREE.TextureLoader();
	// var tex = texLoader.load('https://cdn.obsess-vr.com/lululemon/fish.jpeg');
	// scene.background = tex;
}

window.setUpSceneBackground = setUpSceneBackground;

export const offsetBoundingObjs = (position, boundingObjs, offset = .5) => {
	boundingObjs[0].position.set(position.x + offset, position.y + 1, position.z + offset)
	// boundingObjs[1].position.set(position.x + offset, position.y + .5, position.z - offset)
	// boundingObjs[2].position.set(position.x - offset, position.y + .5, position.z + offset)
	// boundingObjs[3].position.set(position.x - offset, position.y + .5, position.z - offset)

	// boundingObjs[4].position.set(position.x + offset, position.y + 1, position.z + offset)
	// boundingObjs[5].position.set(position.x + offset, position.y + 1, position.z - offset)
	// boundingObjs[6].position.set(position.x - offset, position.y + 1, position.z + offset)
	// boundingObjs[7].position.set(position.x - offset, position.y + 1, position.z - offset)

	// boundingObjs[8].position.set(position.x + offset, position.y + 1.5, position.z + offset)
	// boundingObjs[9].position.set(position.x + offset, position.y + 1.5, position.z - offset)
	// boundingObjs[10].position.set(position.x - offset, position.y + 1.5, position.z + offset)
	// boundingObjs[11].position.set(position.x - offset, position.y + 1.5, position.z - offset)
	return boundingObjs
}

export const createBoundingObjs = (position) => {
	//try again with a cylinder as a bounding obj

	function createBoundingObj() {
		// const objGeometry = new THREE.DodecahedronGeometry();
		const objGeometry = new THREE.SphereGeometry();
		const objMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0
		});
		const boundingObj = new THREE.Mesh(objGeometry, objMaterial);
		boundingObj.position.set(position.x, position.y, position.z);

		return boundingObj;
	}

	let boundingObjsCount = 1;
	let boundingObjs = [];
	for (let i = 0; i < boundingObjsCount; i++) {
		boundingObjs.push(createBoundingObj());
	}
	// let boundingObjs = [createBoundingObj(), createBoundingObj(), createBoundingObj(), createBoundingObj()];


	let boundingObjsWithOffset = offsetBoundingObjs(position, boundingObjs);
	return boundingObjsWithOffset

}

export const createOrbitControls = (camera, renderer, minDist = 2, maxDist = 5, enablePan = false, maxPolarAngle = Math.PI / 2 - 0.05) => {
	let orbitControls;
	orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.minDistance = minDist;
	orbitControls.maxDistance = maxDist;
	orbitControls.enablePan = enablePan;
	orbitControls.maxPolarAngle = maxPolarAngle;
	return orbitControls;
}