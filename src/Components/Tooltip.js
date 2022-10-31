import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { generateRandomString } from '../utils';

export default class Tooltip {
	constructor(params = {}) {
		const DEFAULT_CONTAINER_COLOR = '#00000042';

		//use it only for provided props
		this.config = {
			active: params.active || false,
			text: params?.text || 'Buongiorno!',
			position: params.position || 'bottom',
			offset: Number(params.offset) || 0,
			offset_side_shift: Number(params.offset_side_shift) || 0,
			arrow_color: params?.arrow_color || DEFAULT_CONTAINER_COLOR,
			// container:{
			// 	rotation: params?.container?.rotation || 0,
			// },
			label: {
				bold_on_hover: params?.label?.bold_on_hover,
				color: params?.label?.color || '#fff',
				font_name: params?.label?.font_name || 'arial',
				font_size: params?.label?.font_size || 10,
				wrap_text: params?.label?.wrap_text,
				width: params?.label?.width || 130,
				background_color:
					params?.label?.background_color || DEFAULT_CONTAINER_COLOR,
				padding: params.label?.padding || 10,
				border_radius: params?.label?.border_radius || 0,
				textAlign: 'center', //dont see it coming from params.container!!!
			},
		};

		this.elementWrapper = document.createElement('div');
		this.elementWrapper.id = `tooltip-wrapper-${generateRandomString(5)}`;
		this.tooltipSceneObject = new CSS2DObject(this.elementWrapper);

		// this.mount();
	}

	mount = () => {
		this.initHTML();
		setTimeout(() => {
			this.setTooltipPosition(this.config.position);
			this.setOffset(this.config.offset);
			this.setTooltipStatus(this.config.active);
		}, 500);
	};

	//set element CSS rules from object
	setElementStyling = (el, rulesObj) =>
		Object.entries(rulesObj).map(([key, val]) => {
			if (key === 'background_color') el.style.backgroundColor = val;
			else if (key === 'border_radius')
				el.style.borderRadius = `${val}px`;
			else if (key === 'width') el.style.width = `${val}px`;
			else if (key === 'padding') el.style.padding = `${val}px`;
			else if (key === 'font_name') el.style.fontName = val;
			else if (key === 'font_size') el.style.fontSize = `${val}px`;
			else el.style[key] = val;
		});

	initHTML = () => {
		const defaultContainerStyling = {
			display: 'flex',
			backgroundColor: 'transparent',
			textAlign: 'center',
			overflow: 'hidden',
			height: 'auto',
			transform: 'rotate(0deg)',
			translate: `translate(0px, ${this.config.offset}px)`,
			opacity: 0,
		};

		//container el
		this.containerDiv = document.createElement('div');
		this.containerDiv.id = 'containerDiv';
		this.setElementStyling(this.containerDiv, defaultContainerStyling);
		this.elementWrapper.append(this.containerDiv);

		//arrow el
		this.arrowDiv = document.createElement('div');
		this.arrowDiv.id = 'tooltip-arrow';
		this.arrowDiv.style.height = '0';
		this.arrowDiv.style.width = '10px';
		this.containerDiv.append(this.arrowDiv);
		this.setArrowColor(this.config.arrow_color);

		//tooltip container el
		this.labelDiv = document.createElement('text');
		this.labelDiv.id = 'labelDiv';
		this.labelDiv.style.pointerEvents = 'none';
		this.labelDiv.style.width = `${this.config.label.width}px`;
		this.labelDiv.style.color = this.config.label.color;
		this.setElementStyling(this.labelDiv, this.config.label);

		this.setLabelContent(this.config.text);

		this.containerDiv.append(this.labelDiv);
	};

	setOffset = (
		offset = this.config.offset,
		sideShiftOffset = this.config.offset_side_shift,
	) => {
		if (this.containerDiv.clientWidth < 1)
			console.error('Tooltip container is not ready yet');

		//update
		this.config.offset = Number(offset);
		this.config.offset_side_shift = Number(sideShiftOffset);

		const translateW =
			this.config.offset + this.containerDiv.clientWidth / 2;
		const translateH =
			this.config.offset + this.containerDiv.clientHeight / 2;
		// console.log('>>> setOffset', {
		// 	offset,
		// 	translateW,
		// 	translateH,
		// 	contW: this.containerDiv.clientWidth,
		// 	'this': this,
		// });

		if (this.config.position === 'top') {
			this.containerDiv.style.transform = `translate(${this.config.offset_side_shift}px, -${translateH}px)`;
		} else if (this.config.position === 'bottom') {
			this.containerDiv.style.transform = `translate(${this.config.offset_side_shift}px, ${translateH}px)`;
		} else if (this.config.position === 'left') {
			this.containerDiv.style.transform = `translate(-${translateW}px, ${this.config.offset_side_shift}px)`;
		} else if (this.config.position === 'right') {
			this.containerDiv.style.transform = `translate(${translateW}px, ${this.config.offset_side_shift}px)`;
		}
	};

	setLabelContent = (text) => {
		this.config.text = text;
		this.labelDiv.innerText = text;
	};

	setLabelConfig = (newConfig) => {
		// console.log('>>> setLabelConfig', { newConfig, 'this': this });
		this.config.label = newConfig;
		this.setElementStyling(this.labelDiv, newConfig);
	};

	setArrowColor = (newColor) => {
		this.config.arrow_color = newColor;
		// this.setElementStyling(this.arrowDiv, { borderColor:newColor });
		let bType;
		if (this.config.position === 'left') bType = 'borderLeft';
		else if (this.config.position === 'right') bType = 'borderRight';
		else if (this.config.position === 'top') bType = 'borderTop';
		else if (this.config.position === 'bottom') bType = 'borderBottom';
		this.arrowDiv.style[bType] = `10px solid ${newColor}`;
		// console.log('- setArrowColor', { newColor, 'this': this });
	};

	setTooltipStatus = (status) => {
		// console.log('>>> setTooltipStatus', status);
		this.config.active = status;
		this.containerDiv.style.opacity = status ? '1' : '0';
	};

	setTooltipPosition = (position) => {
		// console.log('>>> setTooltipPosition', position);
		this.config.position = position;
		let arrowDirection = '';
		if (position === 'top') arrowDirection = 'bottom';
		else if (position === 'bottom') arrowDirection = 'top';
		else if (position === 'left') arrowDirection = 'right';
		else if (position === 'right') arrowDirection = 'left';

		//recompute arrow
		switch (arrowDirection) {
			case 'top':
				this.arrowDiv.style.borderLeft = '10px solid transparent';
				this.arrowDiv.style.borderRight = '10px solid transparent';
				this.arrowDiv.style.borderTop = '0px solid transparent';
				this.arrowDiv.style.borderBottom = `10px solid ${this.config.arrow_color}`;
				this.containerDiv.style.flexDirection = 'column';
				this.containerDiv.style.alignItems = 'center';
				break;
			case 'bottom':
				this.arrowDiv.style.borderLeft = '10px solid transparent';
				this.arrowDiv.style.borderRight = '10px solid transparent';
				this.arrowDiv.style.borderBottom = '0px solid transparent';
				this.arrowDiv.style.borderTop = `10px solid ${this.config.arrow_color}`;
				this.containerDiv.style.flexDirection = 'column-reverse';
				this.containerDiv.style.alignItems = 'center';
				break;
			case 'left':
				this.arrowDiv.style.borderRight = `10px solid ${this.config.arrow_color}`;
				this.arrowDiv.style.borderLeft = `0px solid transparent`;
				this.arrowDiv.style.borderTop = '10px solid transparent';
				this.arrowDiv.style.borderBottom = '10px solid transparent';
				this.containerDiv.style.flexDirection = 'row';
				this.containerDiv.style.alignItems = 'center';
				// this.arrowDiv.style.width =0;
				break;
			case 'right':
				this.arrowDiv.style.borderRight = `0px solid transparent`;
				this.arrowDiv.style.borderLeft = `10px solid ${this.config.arrow_color}`;
				this.arrowDiv.style.borderTop = '10px solid transparent';
				this.arrowDiv.style.borderBottom = '10px solid transparent';
				this.containerDiv.style.flexDirection = 'row-reverse';
				this.containerDiv.style.alignItems = 'center';
				// this.arrowDiv.style.width =0;
				break;
			default:
				break;
		}

		//recompute offset
		this.setOffset(this.config.offset);
	};

	//<Hotspot tooltip={}/> props changed
	updateConfig = (newConf) => {
		let offsetNeedsUpdate = false;

		if ('active' in newConf && this.config.active != newConf.active)
			this.setTooltipStatus(newConf.active);

		if (newConf.position && newConf.position !== this.config.position)
			this.setTooltipPosition(newConf.position);
		if (newConf.text && newConf.text !== this.config.text)
			this.setLabelContent(newConf.text);
		if (
			newConf?.label &&
			JSON.stringify(newConf?.label) !== JSON.stringify(this.config.label)
		) {
			this.setLabelConfig(newConf?.label);
			offsetNeedsUpdate = true;
		}
		//offset updated
		if (
			offsetNeedsUpdate ||
			(newConf.offset && newConf.offset != this.config.offset) ||
			(newConf.offset_side_shift &&
				newConf.offset_side_shift != this.config.offset_side_shift)
		) {
			this.setOffset(newConf.offset, newConf.offset_side_shift);
		}

		if (
			'arrow_color' in newConf &&
			newConf.arrow_color != this.config.arrow_color
		)
			this.setArrowColor(newConf.arrow_color);
	};

	dispose = () => {
		this.elementWrapper.remove();
	};
}
