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

import avatar from './av.glb'


let useArmani = false;
// const MODEL_SCALE = [1.2,1.2,1.2];
const MODEL_SCALE = [1, 1, 1];

const createCube = function () {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	window.cube = cube;
	cube.scale.set(1,1,1);
	// cube.position.x=-5.2;
	// cube.position.y=-5.2;
	cube.position.set(0,0,0)
	return cube
}

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
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/px.png",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/nx.png",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/py.png",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/ny.png",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/pz.png",
	"https://cdn.obsess-vr.com/realtime3d/static/environmentMaps/ct_bgmap/nz.png",
]

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
		// let fbxLoader = new FBXLoader();
		// fbxLoader.crossOrigin = true;
		loader.crossOrigin = true;
		// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/mixamoriggedopaque.glb", (data) => {
		// loader.load("https://cdn.obsess-vr.com/realtime3d/Default_Female.glb", (data) => {
		// loader.load("https://cdn.obsess-vr.com/realtime3d/Newhair_female_v002.glb", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/defaultChar_female_v002.glb", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/defaultChar_female_v003.glb", (data) => {


			loader.load("https://cdn.obsess-vr.com/realtime3d/defaultChar_female_v004.glb", (data) => {
				debugger;
			// loader.load("https://cdn.obsess-vr.com/realtime3d/defaultChar_female_v005.glb", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/BaseFemaleAvatar_001.glb", (data) => {
			// loader.load(avatar, (data) => {

			// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/c098fb1c-db90-467a-9fbe-db2d62eac5df.glb", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/female.glb", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/rigged.glb", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/defualtChar_female_v001.fbx", (data) => {
			// loader.load("https://cdn.obsess-vr.com/realtime3d/static/glb_files/animations.glb", (anims) => {
			let animations = data.animations;

			window.animations = animations;
			const model = data.scene;
			// const model = createCube();

			window.model = model;

			let hairs = []
			let pants = []
			let shirts = []
			data.scene.traverse((i)=>{
				if(i.name.includes('Hair')){
					hairs.push(i);
					i.visible=false;
					hairs.push(i);
				}

				if(i.name.includes('Pants')){
					pants.push(i);
					i.visible=false;
					pants.push(i);
				}

				if(i.name.includes('Shirt')){
					shirts.push(i);
					i.visible=false;
					shirts.push(i);
				}

			})

			hairs[0].visible=true;
			// pants[0].visible=true;
			// shirts[0].visible=true;

			data.scene.getChildByName('Shirt2').visible=true;
			data.scene.getChildByName('Pants2').visible=true;
			

			// window.model = createCube();
			// scene.add(window.model);

			// coverGlbWithBoxes(window.model, scene);

			// window.mesh = mesh;



			const charAnimations = animations;

			const mixer = new THREE.AnimationMixer(model);
			const animationsMap = new Map();
			charAnimations.filter(a => a.name != 'T-Pose').forEach((a) => {
				animationsMap.set(a.name, mixer.clipAction(a));
			});
			// let initModelPos = [0, .1,5 ];
			// model.position.set(...initModelPos);

			model.scale.set(...MODEL_SCALE);

			resolve([model, mixer, animationsMap]);
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

window.meshes = [];
window.boxes = [];

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





export const setUpNormalLights = (scene) => {


	const light = new THREE.SpotLight(0xffffff, 0.8);
	light.angle = Math.PI / 3;
	light.position.set(0, 10, 0);
	scene.add(light);
	scene.add(new THREE.AmbientLight(0xffffff, 0.7));
}

export const setUpEnvMap = (scene, renderer) => {
	const cubeTextureLoader = new THREE.CubeTextureLoader()
	const environmentMap = cubeTextureLoader.load(envMapArr)

	environmentMap.encoding = THREE.sRGBEncoding
	scene.environment = environmentMap

}


export const setUpSceneBackground = (scene) => {
	const cubeTextureLoader = new THREE.CubeTextureLoader()

	const backgroundMap = cubeTextureLoader.load(bgArray, (tex) => {

		tex.encoding = THREE.sRGBEncoding
		scene.background = tex
	})


	// let texLoader = new THREE.TextureLoader();
	// var tex = texLoader.load('https://cdn.obsess-vr.com/lululemon/fish.jpeg');
	// scene.background = tex;
}

export const getStoreParts = function () {
	let p = [];
	window.store.traverse((i) => {
		p.push(i)
	})
	window.p = p;
	return p;
}

window.getStoreParts = getStoreParts;

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