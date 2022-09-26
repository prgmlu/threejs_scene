import * as THREE from 'three';
import ParticleSystem from './ParticleSystem';


export default class Smoke {
  constructor({ renderOrder }) {
    const smokeTexture = 'https://raw.githubusercontent.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/clouds.png'
    this.renderOrder = renderOrder;
    this.particles = new ParticleSystem(smokeTexture, this.renderOrder);
    this.clock = new THREE.Clock();
  }

  animateComponent = () => {
    requestAnimationFrame(this.animateComponent)

    const deltaTime = this.clock.getDelta();

    this.particles.update(deltaTime);
  }
}
