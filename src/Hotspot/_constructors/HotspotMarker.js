import * as THREE from 'three';
import InteractionObject from '../../three-base-components/InteractionObject';
import SVGSpriteComponent from '../../three-svg/SVGSpriteComponent';

export default class HotspotMarker extends InteractionObject {
	constructor({
		imageURL = '',
		imageHoverURL = '',
		iconConfig = {},
		userData,
		UIConfig,
		primaryColor = '#000000',
		secondaryColor = '#00000050',
		arrowColor = null,
		onClick = () => {},
		animation = {},
	}) {
		super();
		this.sceneObject.name = 'marker';
		this.hotspot_type = 'hotspot_marker'; //type of marker
		this.userData = userData; //stores custom user data
		this.UIConfig = UIConfig; //could be used for modals

		// this.imageURL = imageURL;
		this.isFlatBackground = false;

		this.animation = animation;
		this.clock = new THREE.Clock();

		this.onClickCallBack = onClick;

		this.primaryColor = primaryColor;
		this.secondaryColor = secondaryColor;

		//SVG Icon
		this.imageURL = imageURL;
		this.imageHoverURL = imageHoverURL;
		this.svgSpriteComponent = new SVGSpriteComponent(iconConfig);
		this.svgSpriteComponent.setSvgFromUrl(imageURL, userData);
	}

	onClick = () => {
		if (this.onClickCallBack) {
			this.onClickCallBack();
		}
	};

	onHover = () => {
		this.svgSpriteComponent.onHover(this.imageHoverURL, this.userData);
	}

	onUnhover = () => {
		this.svgSpriteComponent.onUnhover(this.imageURL, this.userData);
	}

	addToScene = (scene) => {
		this.scene = scene;
		scene.add(this.sceneObject);
		this.isFlatBackground = this.scene.children.some(
			(child) => child.name === 'flatBackground',
		);

		this.attachComponent(this.svgSpriteComponent);

		// Pulsing effect
		if (this.animation) {
			this.setHotspotAnimation();
		}
	};

	setTransform = (colliderTransform, visualTransform) => {
		super.setTransform(colliderTransform, visualTransform);
	};

	setScale = (scale = 0.45) => {
		this.sceneObject.scale.x = scale;
		this.sceneObject.scale.y = scale;
		this.sceneObject.scale.z = scale;
		this.visualObject?.scale.copy(this.sceneObject.scale);
	};

	setHotspotAnimation = () => {
		switch (this.animation.type) {
			case 'pulsing': {
				this.setPulsingHotspot();
				break;
			}
			default:
				break;
		}
	};

	setPulsingHotspot = () => {
		const elapsedTime = this.clock.getElapsedTime();
		const { magnitude, speed, multiplier } = this.animation;
		this.setScale(magnitude + Math.sin(elapsedTime * multiplier) * speed);
		requestAnimationFrame(this.setPulsingHotspot);
	};
}
