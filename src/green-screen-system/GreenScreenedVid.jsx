import * as THREE from 'three';

const createGreenScreenMaterial = function (
	width,
	height,
	keyColor,
	similarity = 0.4,
	smoothness = 0.135,
	spill = 0.9,
) {
	// THREE.ShaderMaterial.call(this);
	let vals = {
		uniforms: {
			tex: {
				value: null,
			},
			keyColor: {
				value: new THREE.Color(keyColor),
			},
			texWidth: {
				value: width,
			},
			texHeight: {
				value: height,
			},
			similarity: {
				value: similarity,
			},
			smoothness: {
				value: smoothness,
			},
			spill: {
				value: spill,
			},
		},
		vertexShader: `	varying vec2 vUv;

     void main() {
         vUv = uv;
         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
     }`,
		fragmentShader: `        uniform sampler2D tex;
     uniform float texWidth;
     uniform float texHeight;

     uniform vec3 keyColor;
     uniform float similarity;
     uniform float smoothness;
     uniform float spill;
             
             varying vec2 vUv;

     // From https://github.com/libretro/glsl-shaders/blob/master/nnedi3/shaders/rgb-to-yuv.glsl
     vec2 RGBtoUV(vec3 rgb) {
       return vec2(
         rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
         rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
       );
     }

     vec4 ProcessChromaKey(vec2 texCoord) {
       vec4 rgba = texture2D(tex, texCoord);
       float chromaDist = distance(RGBtoUV(texture2D(tex, texCoord).rgb), RGBtoUV(keyColor));

       float baseMask = chromaDist - similarity;
       float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);
       rgba.a = fullMask;

       float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
       float desat = clamp(rgba.r * 0.2126 + rgba.g * 0.7152 + rgba.b * 0.0722, 0., 1.);
       rgba.rgb = mix(vec3(desat, desat, desat), rgba.rgb, spillVal);

       return rgba;
     }

     void main(void) {
       vec2 texCoord = vUv;
       gl_FragColor = ProcessChromaKey(texCoord);
     }`,

		transparent: true,
		opacity: 0,
	};
	let sMat = new THREE.ShaderMaterial();
	sMat.side = THREE.DoubleSide;
	sMat.setValues(vals);

	return sMat;
}; // ChromakeyMaterial

export default function GreenScreenedVid(
	vid,
	pos,
	rot,
	keyColor,
	similarity = 0.4,
	smoothness = 0.135,
	spill = 0.9,
) {
	var geometry = new THREE.PlaneGeometry(20, 20);
	geometry.scale(-1, 1, 1);

	let material;
	if (keyColor) {
		material = createGreenScreenMaterial(
			1280,
			720,
			keyColor,
			similarity,
			smoothness,
			spill,
		);
	} else {
		material = new THREE.MeshBasicMaterial({
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 1,
		});
	}

	var vidMesh = new THREE.Mesh(geometry, material);

	vidMesh.position.x = pos.x;
	vidMesh.position.y = pos.y;
	vidMesh.position.z = pos.z;

	vidMesh.rotation.x = rot.x;
	vidMesh.rotation.y = rot.y;
	vidMesh.rotation.z = rot.z;

	if (vid) {
		const video = vid;

		var texture = new THREE.VideoTexture(video);
		if (keyColor) {
			vidMesh.material.uniforms.tex.value = texture;
		} else {
			vidMesh.material.map = texture;
			vidMesh.material.needsUpdate = true;
		}
	}

	return vidMesh;
}
