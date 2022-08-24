import React from 'react';
import { useState } from 'react';
import picker from '../static/avatar/menus/picker.png';
import ColorPicker from './ColorPicker';

const ColorTone = ({ title }) => {
	const [color, setColor] = useState('#000');
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	return (
		<div className="flex justify-between items-center py-2.5 sm:py-3">
			<div className="font-sourceSansProSemibold text-lg">{title}</div>
			<div className="flex">
				<img
					className="rounded-l-md px-2.5 py-11 bg-white object-contain"
					src={picker}
					alt="pick"
				/>
				<div
					onClick={() => setIsPickerVisible(true)}
					className={`w-10 h-88  rounded-r-md cursor-pointer`}
					style={{ backgroundColor: color }}
				></div>
				{isPickerVisible && (
					<ColorPicker
						selectedColor={color}
						handlePicker={setColor}
						handleClose={setIsPickerVisible}
					/>
				)}
			</div>
		</div>
	);
};

export default ColorTone;
