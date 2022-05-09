import InteractionObject from '../three-base-components/InteractionObject';
import SVGSpriteComponent from '../three-svg/SVGSpriteComponent';

export default class VideoControls extends InteractionObject {
	_playing = false;

	constructor(
		scene,
		controlsTransform,
		onPlay,
		onPause,
		playIconUrl,
		pauseIconUrl,
		userData,
	) {
		super();
		this.sceneObject.name = 'marker';
		this.svgSpriteComponent = new SVGSpriteComponent({ showIcon: true });
		this.svgSpriteComponent.setVisibility(false);
		this.svgSpriteComponent.setSvgFromUrl(playIconUrl);
		this.addToScene(scene);
		this.setTransform(controlsTransform);
		this._setScale();
		this.onPlay = onPlay;
		this.onPause = onPause;
		this.userData = userData;
		this.playIconUrl = playIconUrl;
		this.pauseIconUrl = pauseIconUrl;
	}

	setIconForPlayingState = (playing) => {
		if (playing) {
			this.svgSpriteComponent.setSvgFromUrl(this.pauseIconUrl);
		} else {
			this.svgSpriteComponent.setSvgFromUrl(this.playIconUrl);
		}
	};

	set playing(value) {
		this.setIconForPlayingState(value);
		this._playing = value;
	}

	get playing() {
		return this._playing;
	}

	_setScale = () => {
		let minScale = Math.min(
			this.svgSpriteComponent.svgSprite.scale.x,
			this.svgSpriteComponent.svgSprite.scale.y,
		);
		this.svgSpriteComponent.svgSprite.scale.set(
			minScale / 4,
			minScale / 4,
			this.svgSpriteComponent.svgSprite.scale,
		);
	};

	setTransform = (controlsTransform) => {
		super.setTransform(controlsTransform, controlsTransform);
	};

	addToScene = (scene) => {
		this.scene = scene;
		scene.add(this.sceneObject);
		this.attachComponent(this.svgSpriteComponent);
	};

	hideIcon = () => {
		setTimeout(() => {
			this.svgSpriteComponent.setVisibility(false);
		}, 100);
	};

	showIcon = () => {
		this.svgSpriteComponent.setVisibility(true);
	};

	play = () => {
		this.onPlay();
		this.hideIcon();
	};

	pause = () => {
		this.onPause();
		this.showIcon();
	};

	onClick = () => {
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
		this.playing = !this.playing;
	};

	onHover = () => {
		this.svgSpriteComponent.onHover();
		this.showIcon();
	};

	onUnhover = () => {
		this.svgSpriteComponent.onUnhover();
		this.hideIcon();
	};
}
