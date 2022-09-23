import * as THREE from 'three';



export const load3DSceneTextures =(path) =>{
	return new Promise((resolve, reject) => {
		const loader = new THREE.CubeTextureLoader()
		loader.setPath(path)
		loader.load([
				'4k_back.jpg',   //posX
				'4k_front.jpg',  //negX
				'4k_top.jpg',    //posY
				'4k_bottom.jpg', //negY
				'4k_right.jpg',  //posZ
				'4k_left.jpg',   //negZ

				//Note: this order doesnt work correct
				//Cube texture orientation issue: https://github.com/mrdoob/three.js/issues/16328
				//https://stackoverflow.com/questions/56247254/floor-of-skybox-is-rotated-180-degrees-in-three-js
				// '4k_right.jpg',   //posX
				// '4k_left.jpg',   //negX
				// '4k_top.jpg',    //posY
				// '4k_bottom.jpg', //negY
				// '4k_front.jpg',  //posZ
				// '4k_back.jpg',   //negZ
			],
			resolve,
			null,
			reject
		)
	});
}