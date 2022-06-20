import * as THREE from 'three';
import ThreeSceneObject from '../../three-base-components/ThreeSceneObject';
import { setupCamera } from '../../Scene/setupThreeEditor';
import { Geometry } from 'three/examples/jsm/deprecated/Geometry';

const LOD_TO_GRID_SEGMENTS_MAP = Object.freeze({
	0: 1,
	1: 2,
	2: 4,
	3: 8,
});

const LOD_TO_RESOLUTION = Object.freeze({
	0: '512',
	1: '1k',
	2: '2k',
	3: '4k',
});

//units length of the store
const STORE_SIZE = 20;
//how many points to sample on the plane.  Used to check if the face is visible or not
const PTS_COUNT = 16;
// how many requests to prioritize, currently prioritizing level 2 and 3
// so 6 * 2 = 12
const PRIORITIZED_COUNT = 12;

const generatePointsOnPlane = (constantAxis, constantAxisValue) => {
	var pts = [];
	const stepSize = STORE_SIZE / Math.sqrt(PTS_COUNT);
	for (let i = -STORE_SIZE / 2; i < STORE_SIZE / 2; i += stepSize) {
		for (let j = -STORE_SIZE / 2; j < STORE_SIZE / 2; j += stepSize) {
			if (constantAxis === 'x')
				pts.push(new THREE.Vector3(constantAxisValue, i, j));
			if (constantAxis === 'y')
				pts.push(new THREE.Vector3(i, constantAxisValue, j));
			if (constantAxis === 'z')
				pts.push(new THREE.Vector3(i, j, constantAxisValue));
		}
	}
	return pts;
};

const defaultPriorityArray = [
	{ face: 'front', level: 0 },
	{ face: 'right', level: 0 },
	{ face: 'left', level: 0 },
	{ face: 'top', level: 0 },
	{ face: 'bottom', level: 0 },
	{ face: 'back', level: 0 },
	{ face: 'front', level: 1 },
	{ face: 'right', level: 1 },
	{ face: 'left', level: 1 },
	{ face: 'top', level: 1 },
	{ face: 'bottom', level: 1 },
	{ face: 'back', level: 1 },
	{ face: 'front', level: 2 },
	{ face: 'right', level: 2 },
	{ face: 'left', level: 2 },
	{ face: 'front', level: 3 },
	{ face: 'right', level: 3 },
	{ face: 'left', level: 3 },
	{ face: 'top', level: 2 },
	{ face: 'top', level: 3 },
	{ face: 'bottom', level: 2 },
	{ face: 'bottom', level: 3 },
	{ face: 'back', level: 2 },
	{ face: 'back', level: 3 },
];

export default class ThreeBackgroundCube extends ThreeSceneObject {
	constructor(camera, controller) {
		super();

		//get initialized from loadCubeTextureFromPriorityArray
		this.url = null;
		this.loadOpacityMap = false;

		this.faces = this.getDefaultFaces();

		// default load order, gets sorted when the user drags to view different faces, gets consumed in a while loop until empty, then the event is removed.
		this.priorityArrayDefaultConfig = defaultPriorityArray;

		this.priorityArrayMap = {};

		this.camera = camera;
		this.loader = new THREE.TextureLoader();
		this.sceneObject = new THREE.Group();
		this.sceneObject.name = 'cubeBackground';

		Object.keys(this.faces).forEach((face) => {
			this.setFaceTransforms(face);
			this.sceneObject.add(this.faces[face].mesh);
		});

		this.controller = controller;
	}

	getDefaultFaces = () => {
		return {
			front: {
				mesh: new THREE.Mesh(
					this.createFaceGeometry(1).toBufferGeometry(),
					new THREE.MeshBasicMaterial({ color: 0x000000 }),
				),
				facePoints: generatePointsOnPlane('x', -STORE_SIZE / 2),
				LOD: 0,
			},
			right: {
				mesh: new THREE.Mesh(
					this.createFaceGeometry(1).toBufferGeometry(),
					new THREE.MeshBasicMaterial({ color: 0x000000 }),
				),
				facePoints: generatePointsOnPlane('z', -STORE_SIZE / 2),
				LOD: 0,
			},
			left: {
				mesh: new THREE.Mesh(
					this.createFaceGeometry(1).toBufferGeometry(),
					new THREE.MeshBasicMaterial({ color: 0x000000 }),
				),
				facePoints: generatePointsOnPlane('z', STORE_SIZE / 2),
				LOD: 0,
			},
			top: {
				mesh: new THREE.Mesh(
					this.createFaceGeometry(1).toBufferGeometry(),
					new THREE.MeshBasicMaterial({ color: 0x000000 }),
				),
				facePoints: generatePointsOnPlane('y', STORE_SIZE / 2),
				LOD: 0,
			},
			bottom: {
				mesh: new THREE.Mesh(
					this.createFaceGeometry(1).toBufferGeometry(),
					new THREE.MeshBasicMaterial({ color: 0x000000 }),
				),
				facePoints: generatePointsOnPlane('y', -STORE_SIZE / 2),
				LOD: 0,
			},
			back: {
				mesh: new THREE.Mesh(
					this.createFaceGeometry(1).toBufferGeometry(),
					new THREE.MeshBasicMaterial({ color: 0x000000 }),
				),
				facePoints: generatePointsOnPlane('x', STORE_SIZE / 2),
				LOD: 0,
			},
		};
	};

	initPriorityArray = () => {
		this.priorityArrayMap[this.url] =
			this.priorityArrayDefaultConfig.slice();
		this.priorityArrayMap[this.url].forEach((i) => {
			i.initiatorUrl = this.url;
		});
	};

	getViewablePointsInFrustum = (frustum) => {
		let viewable = [];

		Object.keys(this.faces).forEach((face) => {
			const faceViewable = this.faces[face].facePoints.some((point) =>
				frustum.containsPoint(point),
			);
			faceViewable && viewable.push(face);
		});

		return viewable;
	};

	updateViewableFacesAndSortPriorityArray = () => {
		if (this.priorityArrayMap[this.url].length > PRIORITIZED_COUNT) return;
		const frustum = new THREE.Frustum();
		let matrix = new THREE.Matrix4();
		matrix.multiplyMatrices(
			this.camera.projectionMatrix,
			this.camera.matrixWorldInverse,
		);
		frustum.setFromProjectionMatrix(matrix);

		const viewable = this.getViewablePointsInFrustum(frustum);

		this.priorityArrayMap[this.url].sort((a, b) => {
			//hierarchical sorting, first sorting by if the face is visible or not, and second by the level of LOD.
			var aSortKey1 = viewable.includes(a.face) ? '0' : '1';
			var bSortKey1 = viewable.includes(b.face) ? '0' : '1';
			var aSortKey2 = a.level < b.level ? '0' : '1';
			var bSortKey2 = b.level < a.level ? '0' : '1';
			var aFinalKey = aSortKey1 + aSortKey2;
			var bFinalKey = bSortKey1 + bSortKey2;

			if (aFinalKey > bFinalKey) return 1;
			if (aFinalKey < bFinalKey) return -1;

			return 0;
		});
	};

	createFaceGeometry = (LOD) => {
		const face = new THREE.PlaneGeometry(
			STORE_SIZE,
			STORE_SIZE,
			LOD_TO_GRID_SEGMENTS_MAP[LOD],
			LOD_TO_GRID_SEGMENTS_MAP[LOD],
		);
		return new Geometry().fromBufferGeometry(face);
	};

	setFaceTransforms = (face) => {
		switch (face) {
			case 'back':
				this.faces[face].mesh.position.x = STORE_SIZE / 2;
				this.faces[face].mesh.rotation.y = -Math.PI / 2;
				break;
			case 'front':
				this.faces[face].mesh.position.x = -STORE_SIZE / 2;
				this.faces[face].mesh.rotation.y = Math.PI / 2;
				break;
			case 'top':
				this.faces[face].mesh.position.y = STORE_SIZE / 2;
				this.faces[face].mesh.rotation.x = Math.PI / 2;
				break;
			case 'bottom':
				this.faces[face].mesh.position.y = -STORE_SIZE / 2;
				this.faces[face].mesh.rotation.x = -Math.PI / 2;
				break;
			case 'right':
				this.faces[face].mesh.position.z = -STORE_SIZE / 2;
				break;
			case 'left':
				this.faces[face].mesh.position.z = STORE_SIZE / 2;
				this.faces[face].mesh.rotation.y = Math.PI;
				break;
		}
	};

	loadCubeTextureFromPriorityArray = async (
		url,
		opacityMapUrl,
		imageIntegrity,
		useWebp,
		skipLargest,
	) => {
		this.url = url;
		if(opacityMapUrl){
			this.loadOpacityMap = true;
		} 
		else{
			this.loadOpacityMap = false;
		}
		// this.dispose();
		this.initPriorityArray();
		window.addEventListener(
			'click',
			this.updateViewableFacesAndSortPriorityArray,
		);
		window.addEventListener(
			'touchstart',
			this.updateViewableFacesAndSortPriorityArray,
		);
		//transform into a while loop, and pop elements from the front
		let initiatorUrl = this.url;
		this.didCameraReset = false;

		while (this.priorityArrayMap[this.url].length > 0) {
			if (initiatorUrl !== this.url) {
				return;
			}
			const priorityObject = this.priorityArrayMap[this.url].shift();
			let { face, level } = priorityObject;
			if (skipLargest && level === 3) {
				continue;
			}
			initiatorUrl = priorityObject.initiatorUrl;
			const faceLODUrls = this.buildLODUrls(
				url,
				face,
				level,
				imageIntegrity,
				useWebp,
			);

			let tiles,opTiles;
			if (this.loadOpacityMap) {
				//await both the bg tiles and the opacity tiles
				[tiles, opTiles] = await Promise.all([
					this.loadFaceTexturesAsync(faceLODUrls),
					this.loadFaceOpacitiesAsync(
						faceLODUrls.map((i) => i.replace('cube_map', 'opacity_map'))
						)
				])
			} else {
				//else await only the bg images
				tiles = await this.loadFaceTexturesAsync(faceLODUrls);

			}
			if (initiatorUrl !== this.url) {
				return;
			}
			this.updateFace(face, level);
			this.faces[face].mesh.material = tiles;
			if(this.loadOpacityMap){
				for(var i=0; i<this.faces[face].mesh.material.length; i++){
					let u = this.faces[face].mesh.material[i];
					u.alphaMap = opTiles[i];
				}
			}
			this.faces[face].LOD += 1;

			if (!this.didCameraReset) {
				setupCamera(this.camera);
				this.controller.update();
				this.didCameraReset = true;
			}
		}

		this.updateViewableFacesAndSortPriorityArray();
		window.removeEventListener(
			'click',
			this.updateViewableFacesAndSortPriorityArray,
		);
		window.removeEventListener(
			'touchstart',
			this.updateViewableFacesAndSortPriorityArray,
		);
	};

	loadTileMaterialAsync = (tileUrl) => {
		//return a single tile
		return new Promise((resolve, reject) => {
			this.loader.load(tileUrl, (texture) => {
				texture.minFilter = THREE.LinearMipmapNearestFilter;
				texture.magFilter = THREE.LinearFilter;
				resolve(new THREE.MeshBasicMaterial({ 
					map: texture,transparent:true}));
			});
		});
	};

	loadOpacityTextureAsync = (tileUrl) => {
		return new Promise((resolve, reject) => {
			this.loader.load(tileUrl, (texture) => {
				texture.minFilter = THREE.LinearMipmapNearestFilter;
				texture.magFilter = THREE.LinearFilter;
				resolve(texture)
			});
		});
	}

	loadFaceTexturesAsync = (faceLODUrls) => {
		// return a group of tiles
		return Promise.all(faceLODUrls.map(this.loadTileMaterialAsync));
	};

	loadFaceOpacitiesAsync = (faceLODUrls) => {
		// return a group of tiles
		return Promise.all(faceLODUrls.map(this.loadOpacityTextureAsync));
	};

	updateFace = (face, newLevel) => {
		this.faces[face].mesh.geometry = this.createFaceGeometry(newLevel);
		this.setupFaceUV(this.faces[face].mesh.geometry);
		this.resolveFaceMaterialIndexes(this.faces[face].mesh.geometry, face);
	};

	// Build load order of cubemaps
	buildLODUrls = (baseUrl, face, LOD, imageIntegrity, useWebp = false) => {
		if (!baseUrl) return null;

		const loadOrder = [];
		const iterations = LOD_TO_GRID_SEGMENTS_MAP[LOD];
		const resolution = LOD_TO_RESOLUTION[LOD];

		for (let i = iterations - 1; i >= 0; i -= 1) {
			for (let j = 0; j < iterations; j += 1) {
				const imageName = `${baseUrl}${resolution}_${face}_${i}_${j}.${
					useWebp ? 'webp' : 'jpg'
				}?v=${imageIntegrity}`;
				loadOrder.push(imageName);
			}
		}
		return loadOrder;
	};

	resolveFaceMaterialIndexes = (faceGeometry, face) => {
		// eslint-disable-line
		let currentMaterialIndex = 0;
		faceGeometry.faces.forEach((face, index) => {
			face.materialIndex = currentMaterialIndex; // eslint-disable-line
			if (index % 2 === 1) {
				currentMaterialIndex += 1;
			}
		});
		this.faces[face].mesh.geometry = faceGeometry.toBufferGeometry();
	};

	setupFaceUV = (geometry) => {
		const uvArr = geometry.faceVertexUvs[0];
		uvArr.forEach((faceUV, index) => {
			if (index % 2 === 0) {
				faceUV[0].x = 0;
				faceUV[0].y = 1;
				faceUV[1].x = 0;
				faceUV[1].y = 0;
				faceUV[2].x = 1;
				faceUV[2].y = 1;
			} else {
				faceUV[0].x = 0;
				faceUV[0].y = 0;
				faceUV[1].x = 1;
				faceUV[1].y = 0;
				faceUV[2].x = 1;
				faceUV[2].y = 1;
			}
		});
	};

	preLoadConnectedScenes = (linkedScenes) => {
		const imageLoader = new THREE.ImageLoader();
		linkedScenes.forEach((item) => {
			this.buildLODUrls(item, 'front', 0).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'front', 1).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'left', 0).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'left', 1).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'right', 0).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'right', 1).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'top', 0).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'bottom', 0).map((item) =>
				imageLoader.load(item),
			);
			this.buildLODUrls(item, 'back', 0).map((item) =>
				imageLoader.load(item),
			);
		});
	};

	removeAlphaMaps = () => {
		if(! Array.isArray(this.faces.back.mesh.material) ) return ;
		this.faces.front.mesh.material.forEach((mat)=>{
			mat.needsUpdate=true;
			mat.alphaMap=null;
		});
		this.faces.back.mesh.material.forEach((mat)=>{
			mat.needsUpdate=true;
			mat.alphaMap=null;
		});
		this.faces.top.mesh.material.forEach((mat)=>{
			mat.needsUpdate=true;
			mat.alphaMap=null;
		});
		this.faces.bottom.mesh.material.forEach((mat)=>{
			mat.needsUpdate=true;
			mat.alphaMap=null;
		});
		this.faces.right.mesh.material.forEach((mat)=>{
			mat.needsUpdate=true;
			mat.alphaMap=null;
		});
		this.faces.left.mesh.material.forEach((mat)=>{
			mat.needsUpdate=true;
			mat.alphaMap=null;
		});
	}

	dispose = () => {
		Object.keys(this.faces).forEach((face) => {
			let currentFace = this.faces[face];
			currentFace?.mesh?.geometry?.dispose();
			// debugger;
			// if (currentFace.mesh.geometry) {
			//     console.log("dispose geometry ", face)
			// }

			if (currentFace.mesh.material) {
				if (currentFace.mesh.material.length) {
					for (let i = 0; i < currentFace.mesh.material.length; ++i) {
						if (currentFace.mesh.material[i].map) {
							currentFace.mesh.material[i].map = null;
						}
						currentFace.mesh.material[i].dispose();
						currentFace.mesh.material[i].needsUpdate = true;
						// console.log("dispose material ", face)
					}
				} else {
					if (currentFace.mesh.material.map) {
						currentFace.mesh.material.map = null;
					}
					currentFace.mesh.material.dispose();
					currentFace.mesh.material.needsUpdate = true;
					// console.log("dispose material ", face)
				}
			}
		});
	};
}
