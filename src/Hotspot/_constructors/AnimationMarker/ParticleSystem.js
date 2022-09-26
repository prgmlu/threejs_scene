import * as THREE from 'three';

const vertexShader = `
uniform float scale;
attribute float size;
attribute float angle;
attribute vec4 colour;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * scale * 0.1 * projectionMatrix[0][0];
  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const fragmentShader = `
uniform sampler2D diffuseTexture;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;

// linear spline
class LinearSpline {
  constructor(lerp) {
    this.points = [];
    this.lerp = lerp;
  }

  addPoint(t, d) {
    this.points.push([t, d]);
  }

  get(t) {
    let p1 = 0;

    for (let i = 0; i < this.points.length; i++) {
      if (this.points[i][0] >= t) {
        break;
      }
      p1 = i;
    }

    const p2 = Math.min(this.points.length - 1, p1 + 1);

    if (p1 == p2) {
      return this.points[p1][1];
    }

    return this.lerp(
      (t - this.points[p1][0]) / (
        this.points[p2][0] - this.points[p1][0]),
      this.points[p1][1], this.points[p2][1]);
  }
}


export default class ParticleSystem {
  constructor(texture, renderOrder) {
    const uniforms = {
      diffuseTexture: {
        value: new THREE.TextureLoader().load(texture)
      },
      scale: {
        value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };

    // material
    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });

    this.particles = [];

    // buffer geometry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this.geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this.geometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this.geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    // points to be rendered
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.renderOrder = renderOrder;

    // specifying the alpha at various points in the smoke life
    this.alphaSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this.alphaSpline.addPoint(0.0, 0.0);
    this.alphaSpline.addPoint(0.1, 1.0);
    this.alphaSpline.addPoint(0.6, 1.0);
    this.alphaSpline.addPoint(1.0, 0.0);

    // specifying the color at various points in the smoke life
    this.colourSpline = new LinearSpline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });
    this.colourSpline.addPoint(0.0, new THREE.Color(0xD3D3D3));
    this.colourSpline.addPoint(1.0, new THREE.Color(0xD3D3D3));


    // specifying the size at various points in the smoke life
    this.sizeSpline = new LinearSpline((t, a, b) => {
      return a + t * (b - a);
    });
    this.sizeSpline.addPoint(0.0, 1.0);
    this.sizeSpline.addPoint(0.5, 3.0);
    this.sizeSpline.addPoint(1.0, 1.0);

    this.updateGeometry();
  }

  // adding particles
  addParticles = (deltaTime) => {
    if (!this.tick) {
      this.tick = 0.0;
    }
    this.tick += deltaTime;
    const n = Math.floor(this.tick * 15.0);
    this.tick -= n / 15.0;

    // define some particles
    for (let i = 0; i < n; i++) {
      this.particles.push({
        position: new THREE.Vector3(0.0, 0.0, 0.0),
        size: 1.0,
        colour: new THREE.Color(),
        alpha: 0.5,
        life: 0.5,
        maxLife: 0.5,
        rotation: Math.random() * 2.0 * Math.PI,
        velocity: new THREE.Vector3(0, 10, 0),
      });
    }
  }

  // iterate over the list of particles and update the buffer geometry
  updateGeometry = () => {
    const positions = [];
    const sizes = [];
    const colours = [];
    const angles = [];

    for (let p of this.particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      sizes.push(p.currentSize);
      angles.push(p.rotation);
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    this.geometry.setAttribute('colour', new THREE.Float32BufferAttribute(colours, 4));
    this.geometry.setAttribute('angle', new THREE.Float32BufferAttribute(angles, 1));

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
    this.geometry.attributes.colour.needsUpdate = true;
    this.geometry.attributes.angle.needsUpdate = true;
  }

  // updating particles
  updateParticles = (deltaTime) => {
    for (let p of this.particles) {
      p.life -= deltaTime;
    }

    this.particles = this.particles.filter(p => {
      return p.life > 0.0;
    });

    for (let p of this.particles) {
      const t = 1.0 - p.life / p.maxLife;

      p.rotation += deltaTime * 0.5;
      p.alpha = this.alphaSpline.get(t);
      p.currentSize = p.size * this.sizeSpline.get(t);
      p.colour.copy(this.colourSpline.get(t));

      p.position.add(p.velocity.clone().multiplyScalar(deltaTime));

      const drag = p.velocity.clone();
      drag.multiplyScalar(deltaTime * 0.1);
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      p.velocity.sub(drag);
    }
  }

  update = (deltaTime) => {
    this.addParticles(deltaTime);
    this.updateParticles(deltaTime);
    this.updateGeometry();
  }
}