import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_long.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
import d_hair from '../../static/avatar/demo/demo_hair.png';
import d_eyelash from '../../static/avatar/demo/demo_eyelashes.png';
import d_eye from '../../static/avatar/demo/demo_eyes.png';

let setHairMesh = (index,currentAvatar) => {
	let hairNames = [
		'Hair1',
		'Hair2',
		'Hair3',
		'Hair4',
		'Hair5',
	]
	hairNames.forEach((i)=>{
		try{
			currentAvatar.getChildByName(i).visible = false;
		}
		catch(e){
			console.log(e);
		}
	});

	let hairMeshName = 'Hair' + (index+1);
	currentAvatar.getChildByName(hairMeshName).visible = true;
}



let setEyebroMesh = (index,currentAvatar) => {


	let eyebrowNames = [
		'Eyebrow1',
		'Eyebrow2',
		'Eyebrow3',
		'Eyebrow4',
		'Eyebrow5',
	]
	eyebrowNames.forEach((i)=>{
		try{
			currentAvatar.getChildByName(i).visible = false;
		}
		catch(e){
			console.log(e);
		}
	}
	);
	
	let eyebrowMeshName = 'Eyebrow' + (index+1);
	currentAvatar.getChildByName(eyebrowMeshName).visible = true;
}


const Face = ({currentAvatar}) => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);

	const titles = ['Hair', 'Eyebrows', 'Eyes'];

	let hairImages = [
		'https://cdn.obsess-vr.com/realtime3d/skintones/Hair1.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Hair2.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Hair3.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Hair4.png',
	]

	let eyebrowImages = [
		'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow1.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow2.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow3.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow4.png',
		'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow5.png',
	]

	const demo_items_count = 30;

	useEffect(() => {
		getContents(selectedTone);
	}, [selectedTone]);

	const getContents = (index) => {
		let arr;
		if(index === 0) {
			arr = hairImages;
		} else if(index === 1) {
			arr = eyebrowImages
		}
		else if(index === 2) {
			arr = hairImages
		}
		let temp = [];
		// for (let i = 0; i < demo_items_count; i++) {
		for (let i = 0; i < arr.length; i++) {
			switch (index) {
				case 0:
					temp.push(arr[i]);
					break;
				case 1:
					temp.push(arr[i]);
					break;
				case 2:
					temp.push(d_eye);
					break;
			}
		}
		setDataTones([...temp]);
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="w-full h-full flex flex-col px-2">
				<div className="flex flex-col gap-2">
					<div className="w-full flex flex-wrap items-center justify-between">
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-99 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 0
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={hair}
							alt="HAIR"
							onClick={() => setSelectedTone(0)}
						/>
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-99 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 1
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eyelash}
							alt="EYELASH"
							onClick={() => setSelectedTone(1)}
						/>
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-99 object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 2
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eye}
							alt="EYE"
							onClick={() => setSelectedTone(2)}
						/>
					</div>
				</div>
				<ColorTone title={titles[selectedTone]} currentAvatar={currentAvatar}
				selectedTone={selectedTone}
				 />
				<div className="w-full h-full flex flex-wrap justify-between gap-y-1 px-1 pb-2 sm:my-2 overflow-y-auto scrollbar-[2px] scrollbar-thumb-gray-500 scrollbar-track-gray-200">
					{dataTones.map((item, index) => (
						<div key={index} className="w-fit h-fit relative p-1">
							{selectedStyle === index && (
								<span className="absolute top-0 right-0 w-3 h- object-contain">
									<img src={check} alt="o" />
								</span>
							)}
							<img
								src={item}
								className={`w-[70px] sm:w-[72px] h-99 object-contain rounded px-2 py-11 cursor-pointer shadow-md bg-white ${
									selectedStyle === index &&
									'border-2 border-[#FF9F9F]'
								}`}
								alt=""
								onClick={() => {setSelectedStyle(index);
									if(selectedTone === 0) {
									 setHairMesh(index, currentAvatar);
									} else if(selectedTone === 1) {
										setEyebroMesh(index, currentAvatar);
									} else if(selectedTone === 2) {
										// setEyeMesh(index, currentAvatar);
									}

									}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Face;
