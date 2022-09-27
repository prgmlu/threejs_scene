import React from 'react';
import { useState } from 'react';
import picker from '../static/avatar/menus/picker.png';
import ColorPicker from './ColorPicker';

let setHairColor = (color, currentAvatar) => {
	let hairs = ['Hair1', 'Hair2', 'Hair3', 'Hair4', 'Hair5'];

	hairs.forEach((i) => {
		try {
			let mesh = currentAvatar.getObjectByName(i);
			let material = mesh.material;
			material.map = null;
			material.color.set(color);
			material.needsUpdate = true;
		} catch (e) {
			console.log(e);
		}
	});

	let hairMesh = currentAvatar.getObjectByName('Hair1');
	hairMesh.material.color.set(color);
};

let setEyebrowColor = (color,currentAvatar) => {
	let eyebrows = [
		'Eyebrow1',
	];

	eyebrows.forEach((i)=>{
		try{
			let mesh = currentAvatar.getObjectByName(i);
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

}

let setEyeColor = (color,currentAvatar) => {
	let eyebrows = [
		'Eye1',
	];

	eyebrows.forEach((i)=>{
		try{
			let mesh = currentAvatar.getObjectByName(i);
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
}



const ColorTone = ({ title, currentAvatar, selectedTone }) => {
	// const [color, setColor] = useState('#000');
	const [color, setColor] = useState({'Hair': '#000', 'Eyebrows': '#000', 'Eyes': '#000'});
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	return (
		<div className="flex justify-between items-center py-2.5 sm:py-3">
			<div className="font-sourceSansProSemibold text-lg">{title}</div>
			<div className="flex">
				<img
					className="rounded-l-md px-2.5 py-1 bg-white object-contain"
					src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/palette.svg"}
					alt="pick"
				/>
				<div
					onClick={() => setIsPickerVisible(true)}
					className={`w-10 h-[32px] rounded-r-md cursor-pointer`}
					style={{ backgroundColor: color[title] }}
				></div>
				{isPickerVisible && (
					<ColorPicker
						selectedColor={color[title]}
						handlePicker={(c)=>{
							let newColor = c;

							let newObj = {...color};
							newObj[title] = newColor;
							setColor(newObj);
							if(title == 'Hair'){
								setHairColor(c,currentAvatar);
							}
							if(title == 'Eyebrows'){
								setEyebrowColor(c,currentAvatar);
							}
							if(title == 'Eyes'){
								setEyeColor(c,currentAvatar);
							}
							 }}
						handleClose={setIsPickerVisible}
					/>
				)}
			</div>
		</div>
	);
};

export default ColorTone;
