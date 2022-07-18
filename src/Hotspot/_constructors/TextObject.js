import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import InteractionObject from '../../three-base-components/InteractionObject';

export default class TextObject extends InteractionObject {
	constructor({
		transform,
		collider_transform,
		userData,
		UIConfig,
		boxColliderConfig,
		camera,
		visible = true,
		containerStyling = null,
		labelStyling = null,
		arrowConfig = null,
	}) {
		super({
			transform,
			collider_transform,
			boxColliderConfig,
			UIConfig,
			camera,
			userData,
		});

		this.collider_transform = collider_transform;
		this.transform = transform;

		this.sceneObject.name = 'textObject';

		this.elementWrapper = document.createElement('div');

		this.containerDiv = document.createElement('div');

		this.containerDiv.id = 'containerDiv';
		this.containerDiv.style.height = 'auto';
		this.containerDiv.style.overflow = 'hidden';
		this.containerDiv.style.textAlign = 'center';
		this.containerDiv.style.display = 'flex';

		this.containerDiv.style.backgroundColor = 'transparent';
		this.containerDiv.style.transform = 'rotate(0deg)';
		this.elementWrapper.append(this.containerDiv);

		this.arrowDiv = document.createElement('div');

		this.textDiv = document.createElement('text');
		this.textDiv.id = 'textDiv';
		this.textDiv.style.pointerEvents = 'none';
		// this.textDiv.style.width = "100%"
		this.textDiv.style.opacity = '1';

		this.arrowDiv.style.height = '0';
		this.arrowDiv.style.width = '20px';

		this.containerDiv.append(this.arrowDiv);

		this.containerDiv.append(this.textDiv);

		this.setContainerStyling(containerStyling);
		this.setLabelStyling(labelStyling);
		if (arrowConfig) {
			this.setArrowConfig(arrowConfig);
		}

		this.setUserData(userData);

		this.visualObject = new CSS2DObject(this.elementWrapper);
		this.setVisibility(visible);
		this.visualObject.owner = this;

		this.visualObject.name = this.userData?.props?.hotspot_type;
	}

	setVisibility = (visible) => {
		this.visualObject.visible = visible;
	};

	addToScene = (scene) => {
		//INIT Scene, place objects
		this.scene = scene;
		scene.add(this.sceneObject);
		scene.add(this.visualObject);
		//Set transforms if provided (existing record)
		if (this.collider_transform && this.transform) {
			//DO NOTHING
			this.setTransform(this.transform, this.transform);
		}
		//NEW Object
		else {
		}
	};

	show = () => {
		this.visualObject.visible = true;
	};

	hide = () => {
		this.visualObject.visible = false;
	};

	setArrowDirection = (arrowDirection = 'right', arrowColor = 'black') => {
		this.containerDiv.style.display = 'flex';

		switch (arrowDirection) {
			case 'top':
				this.arrowDiv.style.borderLeft = '10px solid transparent';
				this.arrowDiv.style.borderRight = '10px solid transparent';
				this.arrowDiv.style.borderBottom = `10px solid ${arrowColor}`;
				this.containerDiv.style.flexDirection = 'column';
				this.containerDiv.style.alignItems = 'center';
				break;
			case 'bottom':
				this.arrowDiv.style.borderLeft = '10px solid transparent';
				this.arrowDiv.style.borderRight = '10px solid transparent';
				this.arrowDiv.style.borderTop = `10px solid ${arrowColor}`;
				this.containerDiv.style.flexDirection = 'column-reverse';
				this.containerDiv.style.alignItems = 'center';
				break;
			case 'left':
				this.arrowDiv.style.borderRight = `10px solid ${arrowColor}`;
				this.arrowDiv.style.borderTop = '10px solid transparent';
				this.arrowDiv.style.borderBottom = '10px solid transparent';
				this.containerDiv.style.flexDirection = 'row';
				this.containerDiv.style.alignItems = 'center';
				break;
			case 'right':
				this.arrowDiv.style.borderLeft = `10px solid ${arrowColor}`;
				this.arrowDiv.style.borderTop = '10px solid transparent';
				this.arrowDiv.style.borderBottom = '10px solid transparent';
				this.containerDiv.style.flexDirection = 'row-reverse';
				this.containerDiv.style.alignItems = 'center';
				break;
			default:
				break;
		}
	};

	setContainerStyling = (containerStyling) => {
		this.containerStyling = containerStyling;
		this.containerDiv.style.transform = `rotate(${
			this.containerStyling?.rotation || 0
		}deg)`;
		this.textDiv.style.width = `${this.containerStyling?.width || 50}px`;
		this.textDiv.style.borderRadius = `${
			this.containerStyling?.border_radius || 0
		}px`;
		this.textDiv.style.backgroundColor =
			this.containerStyling?.background_color || 'transparent';
		this.textDiv.style.padding = `${
			this.containerStyling?.padding || 10
		}px`;
	};

	setLabelStyling = (labelStyling) => {
		console.log('=> labelStyling', labelStyling);
		this.labelStyling = labelStyling;
		this.textDiv.innerText = this.labelStyling?.text || '';
		this.textDiv.style.fontFamily = this.labelStyling?.name || 'lato';
		this.textDiv.style.fontSize = `${this.labelStyling?.size || 10}px`;
		this.textDiv.style.color = this.labelStyling?.color || '#000000';
	};

	setArrowConfig = (arrowConfig) => {
		this.arrowConfig = arrowConfig;
		const arrowColor =
			this.arrowConfig?.arrow_color ||
			this.containerStyling?.background_color;
		this.setArrowDirection(
			this.arrowConfig?.arrow_direction || 'top',
			arrowColor,
		);
	};
}
