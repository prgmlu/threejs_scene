import React from 'react';
import Tooltip from './Tooltip';
import ReactDOM from 'react-dom';

export default class ContentTooltip extends Tooltip {
	constructor(params = {}, component, componentProps, canvas) {
		super(params);
		this.parentDimensions = params.dimensions;
		this.component = component;
		this.componentProps = componentProps;
		this.canvas = canvas;
	}

	mount = () => {
		this.initHTML();
	};

	// override
	initHTML = () => {
		//container el
		this.containerDiv = document.createElement('div');
		this.containerDiv.id = 'containerDiv';
		this.containerDiv.style.pointerEvents = 'auto';
		this.containerDiv.style.opacity = 0;
		this.elementWrapper.append(this.containerDiv);
		const { component: Component } = this;
		ReactDOM.render(
			React.cloneElement(Component, {
				...this.componentProps,
				...Component.props,
			}),
			this.containerDiv,
		);
		this.setPosition();
	};

	setTooltipStatus = (status) => {
		if (status !== this.config.active) {
			this.config.active = status;
			this.containerDiv.style.display = status ? 'block' : 'none';
			this.containerDiv.style.opacity = 0;
			this.containerDiv.style.transform = 'unset';
			this.setPosition();
		}
	};

	setOffset = (
		offset = this.config.offset,
		sideShiftOffset = this.config.offset_side_shift,
	) => {
		if (this.containerDiv.clientWidth < 1) return;

		//update
		this.config.offset = Number(offset);
		this.config.offset_side_shift = Number(sideShiftOffset);

		this.containerDiv.style.transform = `translate(${this.config.offset_side_shift}px, ${this.config.offset}px)`;
	};

	getOffset = () => {
		const containerBox = this.containerDiv.getBoundingClientRect();
		const canvasBoundingBox = this.canvas.getBoundingClientRect();

		let verticalOffset = -(
			containerBox.height / 2 +
			this.parentDimensions.height
		);

		let horizontalOffset =
			containerBox.width / 2 + this.parentDimensions.width;

		if (verticalOffset + containerBox.top < 0) {
			verticalOffset = -verticalOffset;
		}

		if (horizontalOffset + containerBox.right > canvasBoundingBox.width) {
			horizontalOffset = -horizontalOffset;
		}

		return { horizontalOffset, verticalOffset };
	};

	setPosition = () => {
		setTimeout(() => {
			const { horizontalOffset, verticalOffset } = this.getOffset();
			this.setOffset(verticalOffset, horizontalOffset);
			this.containerDiv.style.opacity = 1;
			this.containerDiv.style.transition = 'opacity 0.2s ease-in-out';
		}, 50);
	};
}
