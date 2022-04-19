import ThreeSceneObjectComponent from '../three-base-components/ThreeSceneObjectComponent';
import SVGSprite from './SVGSprite';

// This component controls the interaction of the SVGSprite. We can further
// break this down to smaller components but I don't think it's necessary at the moment
// because this is how all of the sprites behave and it only controls the color
// interactions right now.
export default class SVGSpriteComponent extends ThreeSceneObjectComponent {
	constructor(conf = {}) {
		const { dotColor, secondaryColor, color, showIcon } = conf;
		super();
		this.name = 'sprite';
		this.svgString = '';
		this.primaryColor = dotColor || 'black';
		this.showIcon = showIcon;

		// this.secondaryColor = secondaryColor || 'gray';
		// * IMPORTANT: This needs to be white on init,
		// * because by default the svg value that have modifiable fill colors are white.
		this.color = color || 'black';

		// * IMPORTANT: This needs to be 0 on init,
		// * because by default the svg value that have modifiable transform x is 0.
		this.rotationX = 0;

		this.svgSprite = new SVGSprite();
		this.dispose = this.dispose.bind(this);
	}

	setSVGString = (svgString) => {
		this.svgString = svgString;
		this.svgSprite.setSVGString(svgString);
		// this.setColor(this.primaryColor);
	};

	setScale(scale) {
		this.svgSprite.scale.set(scale, scale, scale);
	}

	//TODO: implement properly color assignment for dot, background and border.
	setColor = (color) => {
		if (!this.svgString) {
			console.error(`SVG string not set on SVGSpriteComponent: ${this}`); // eslint-disable-line no-console
			return;
		}
		const regexString = this.color.replace(/\(|\)/g, '\\$&');
		// eslint-disable-line
		this.svgString = this.svgString.replace(
			new RegExp(`fill="${regexString}"`, 'g'),
			`fill=\"${color}\"`,
		);
		this.svgSprite.setSVGString(this.svgString);
		this.color = color;
	};

	setRotationX(rotX) {
		if (!this.svgString) {
			console.error(`SVG string not set on SVGSpriteComponent: ${this}`); // eslint-disable-line no-console
			return;
		}
		this.svgString = this.svgString.replace(
			`rotate(${this.rotationX} 256 256)`,
			`rotate(${rotX} 256 256)`,
		);
		this.svgSprite.setSVGString(this.svgString);
		this.rotationX = rotX;
	}

	onHover = () => {
		document.body.style.cursor = 'pointer';
		// if (this.color === this.secondaryColor) return;
		// this.setColor(this.secondaryColor);
	};

	onUnhover = () => {
		document.body.style.cursor = 'default';
		// if (this.color === this.primaryColor) return;
		// this.setColor(this.primaryColor);
	};

	onClick() {} // eslint-disable-line

	setOwner(owner) {
		super.setOwner(owner);
		const svgSpriteComponents =
			this.owner.getComponentsOfType(SVGSpriteComponent);
		if (svgSpriteComponents && svgSpriteComponents.length > 0) {
			throw new Error(
				'Interactable Object can only have a single SVGSpriteComponent attached!',
			);
		}

		if (this.showIcon) {
			this.owner.setVisualObject(this.svgSprite);
			this.owner.visualObject.renderOrder = 1000;
			this.owner.visualObject.material.depthTest = false;

			if (this.owner.scene) {
				this.owner.scene.add(this.owner.visualObject);
			}
		}
	}

	removeOwner() {
		if (!this.owner) {
			console.error(
				"Can't remove a SVGSpriteComponent that is not attached to an Interactable Object",
			); // eslint-disable-line no-console
			return;
		}
		if (this.owner.scene) this.owner.scene.remove(this.owner.visualObject);

		this.owner.setVisualObject(null);
		super.removeOwner();
	}

	dispose() {
		this.svgSprite.dispose();
		this.removeOwner();
	}
}
