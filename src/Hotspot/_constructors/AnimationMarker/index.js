import InteractionObject from '../../../three-base-components/InteractionObject';
import Fire from './Fire';
import Smoke from './Smoke';
import Star from './Star';

export default class AnimationMarker extends InteractionObject {
	#clickPoint;
	#animationType;
	#visualObjectConf;
	constructor({ transform, collider_transform, visualObjectConf, userData, UIConfig, boxColliderConfig, camera, clickPoint, enable_moving_visual_only }) {
		super({ transform, collider_transform, boxColliderConfig, UIConfig, camera, enable_moving_visual_only });
		const { animationType } = visualObjectConf;
		this.sceneObject.name = 'marker'; //type of marker
		this.userData = userData; //stores custom user data
		this.transform = transform;
		this.collider_transform = collider_transform;
		this.#clickPoint = clickPoint;
		this.#animationType = animationType || 'stars'; //for now, stars is our default render
		this.#visualObjectConf = visualObjectConf;

		if (this.#animationType === 'stars') {
			this.component = new Star({ color: { r: 1, g: 1, b: 1 }, renderOrder: this.#visualObjectConf.renderOrder || 2 });
			this.visualObject = this.component;
		}
		else if (this.#animationType === 'fire') {
			this.initFireComponent();
		}
		else if (this.#animationType === 'smoke') {
			this.initSmokeComponent();
		}
	}

	initFireComponent = () => {
		this.component = new Fire(this.#visualObjectConf.renderOrder || 2 );
		this.visualObject = this.component;
	}

	initSmokeComponent = () => {
		this.component = new Smoke(this.#visualObjectConf.renderOrder || 2 );
		this.visualObject = this.component.particles.points;
	}



	addToScene = (scene) => {
		this.scene = scene;
		scene.add(this.sceneObject);
		scene.add(this.visualObject);

		//call animation method. All animation sub-components should have same animate method name for consistency
		this.component.animateComponent();


		//Set transforms (scale, position, rotation) if provided (existing record)
		if (this.collider_transform && this.transform) {
			this.setTransform(this.collider_transform, this.transform);
		}
		//new record
		else {
			//Place new objects on the click event location
			if (this.#clickPoint) this.setPosition(this.#clickPoint.x, this.#clickPoint.y, this.#clickPoint.z);

			// this.lookAtCamera();
			this.onClick(); // open UI for new objects
		}
	}

	updateVisualObjectConf = (newConf) => {
		//Animation type changed
		if (newConf.animationType !== this.#animationType) {
			const pos = this.component.position;
			this.component?.dispose();//dispose component, stop loop
			this.scene.remove(this.component);

			//init new component
			if (newConf.animationType === 'fire') {
				this.initFireComponent();
			}
			else if (newConf.animationType === 'smoke') {
				this.initSmokeComponent();
			}

			//add new component to scene on same position and animate
			this.scene.add(this.visualObject);
			this.visualObject.position.set(pos.x, pos.y, pos.z);
			this.component.animateComponent();
		}

	}


	setPosition = (x, y, z) => {
		this.sceneObject.position.set(x, y, z);
		this.visualObject?.position.copy(this.sceneObject.position);
	};


	dispose = () => {
		this.scene.remove(this.sceneObject);
		this.scene.remove(this.visualObject);
		super.dispose();

		this.sceneObject = null;

	}
}