import React from 'react';
import { HexColorPicker } from 'react-colorful';
import close from '../static/avatar/menus/close.png';

const ColorPicker = ({ selectedColor, handlePicker, handleClose }) => {
	return (
		<div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-fit h-fit z-40 p-3 bg-gray-100 rounded-md">
			<img
				onClick={() => handleClose(false)}
				className="absolute z-50 w-6 h-6 -top-1.5 -right-1.5 cursor-pointer"
				src={close}
				alt="CLOSE"
			/>
			<HexColorPicker
				color={selectedColor}
				onChange={(color) => handlePicker(color)}
			/>
		</div>
	);
};

export default ColorPicker;
