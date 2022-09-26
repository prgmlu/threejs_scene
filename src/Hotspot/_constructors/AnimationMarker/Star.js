import * as THREE from 'three';

function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

const SPIRE_TEXTURE_URL = 'https://cdn.obsess-vr.com/sams-club/transparent-light.png'

export default class Star extends THREE.Mesh {
    constructor({ color, renderOrder }) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const starTexture = new THREE.TextureLoader().load(SPIRE_TEXTURE_URL)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                alpha: { type: 'f', value: 2.0 },
                uTexture: { type: 't', value: starTexture },
                colorVariance: {
                    type: 'c',
                    value: color,
                },
            },
            vertexShader: `varying vec2 vUV;

           	void main() {
               	vUV = uv;
               	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
           	}
           	`,
            fragmentShader: `precision lowp float;

           	uniform float alpha;
           	uniform sampler2D uTexture;

           	uniform lowp vec3 colorVariance;
           	varying vec2 vUV;

           	const vec2 centerPos = vec2(0.5, 0.5);
           	const float radiusFactor = 3.0;

           	void main() {
               	float distanceToCenter = distance(vUV, centerPos);
               	float alphaFactor = mix(alpha, 0.0, distanceToCenter * radiusFactor);
               	vec4 color = texture2D(uTexture, vec2(vUV.x, vUV.y));
               	gl_FragColor = vec4(color.xyz, color.a * alphaFactor) * vec4(colorVariance.rgb, 1.0);
          
           	}
           	`,
            transparent: true,
        })
        material.depthWrite = false;
        material.depthTest = false;

        super(geometry, material);
        this.name = 'star_component';
        this.color = color;
        this.renderOrder = renderOrder;
        this.requestID = null;// this variable to cancel requestAnimationFrame with.

        this.clock = new THREE.Clock()
        this.clock.start()
        this.setRenderOrder(this.renderOrder);
    }

    setRenderOrder = (renderOrder) => {
        this.renderOrder = renderOrder;
    };

    animateComponent = () => {
        this.requestID = requestAnimationFrame(this.animateComponent)
        if (!this.FREQUENCY) {
            this.FREQUENCY = getRandom(3, 5);
            this.AMPLITUDE = getRandom(3, 2);
            this.VERTICAL_SHIFT = getRandom(3, 3);
        }

        this.material.uniforms.alpha.value =
            this.AMPLITUDE *
            Math.sin(this.FREQUENCY * this.clock.getElapsedTime()) +
            this.VERTICAL_SHIFT
    }

    dispose() {
        cancelAnimationFrame(this.requestID);
    }
}
