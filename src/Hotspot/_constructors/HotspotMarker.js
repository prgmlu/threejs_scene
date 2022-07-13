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

		// animation info
		this.animation = animation;
		this.clock = new THREE.Clock();
		this.clock.autoStart = false;
		this.animationDelay = 300; // (ms) defined by product in issue 6192
		this.animationScale = 1.2; // (120%) defined by product in issue 6192
		this.sinOffset = (3 * Math.PI) / 2; // offset to start at lowest point
		this.animationCycle = animation.hotspot_pulsing_frequency;

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
	};

	onUnhover = () => {
		this.svgSpriteComponent.onUnhover(this.imageURL, this.userData);
	};

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
				this.clock.start();
				this.setPulsingHotspot();
				break;
			}
			default:
				break;
		}
	};

	setPulsingHotspot = () => {
		const { enabled, hotspot_pulsing_frequency } = this.animation;
		if (enabled && hotspot_pulsing_frequency) {
			this.animationCycle -= this.clock.getDelta();
			const elapsedTime = this.clock.getElapsedTime();
			if (this.animationCycle > 0) {
				// oscillate between base scale and the animation scale at a given frequency
				this.setScale(
					this.animation.baseScale * ((1 + this.animationScale) / 2) + // range to go between
						((this.animationScale - 1) / 2) *
							// sin wave as a function of time
							Math.sin(
								this.sinOffset +
									2 *
										Math.PI *
										elapsedTime *
										(1 / hotspot_pulsing_frequency),
							),
				);
				// request the animation
				requestAnimationFrame(this.setPulsingHotspot);
			} else {
				// pause after every cycle for a given delay
				this.animationCycle = hotspot_pulsing_frequency;
				this.clock.stop();
				setTimeout(() => {
					this.clock.start();
					requestAnimationFrame(this.setPulsingHotspot);
				}, this.animationDelay);
			}
		}
	};
}
