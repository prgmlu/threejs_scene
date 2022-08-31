import React from 'react';
import { useState } from 'react';
import picker from '../static/avatar/menus/picker.png';
import ColorPicker from './ColorPicker';


let setHairColor = (color,currentAvatar) => {
	let hairs = [
		'Hair1',
		'Hair2',
		'Hair3',
		'Hair4',
		'Hair5',
	];


	hairs.forEach((i)=>{
		try{
			let mesh = currentAvatar.getChildByName(i);
			let material = mesh.material;
			material.map = null;
			material.color.set(color);
			material.needsUpdate = true;
		}
		catch(e){
			console.log(e);
		}
	}
	);

	let hairMesh = currentAvatar.getChildByName('Hair1');
	hairMesh.material.color.set(color);
}

const ColorTone = ({ title ,currentAvatar, selectedTone}) => {

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
						handlePicker={(c)=>{setColor(c); setHairColor(c,currentAvatar); }}
						handleClose={setIsPickerVisible}
					/>
				)}
			</div>
		</div>
	);
};

export default ColorTone;
