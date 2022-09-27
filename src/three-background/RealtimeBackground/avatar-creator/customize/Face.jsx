import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_long.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
import d_hair from '../../static/avatar/demo/demo_hair.png';
import d_eyelash from '../../static/avatar/demo/demo_eyelashes.png';
import d_eye from '../../static/avatar/demo/demo_eyes.png';

let setHairMesh = (index, currentAvatar) => {
	let hairNames = ['Hair1', 'Hair2', 'Hair3', 'Hair4', 'Hair5'];
	hairNames.forEach((i) => {
		try {
			currentAvatar.getObjectByName(i).visible = false;
		} catch (e) {
			console.log(e);
		}
	});

	let hairMeshName = 'Hair' + (index + 1);
	currentAvatar.getObjectByName(hairMeshName).visible = true;
};

let setEyebroMesh = (index, currentAvatar) => {
	let eyebrowNames = [
		'Eyebrow1',
		'Eyebrow2',
		'Eyebrow3',
		'Eyebrow4',
		'Eyebrow5',
	];
	eyebrowNames.forEach((i) => {
		try {
			currentAvatar.getObjectByName(i).visible = false;
		} catch (e) {
			console.log(e);
		}
	});

	let eyebrowMeshName = 'Eyebrow' + (index + 1);
	currentAvatar.getObjectByName(eyebrowMeshName).visible = true;
};

let setEyeFromMorphTarget = (index, currentAvatar) => {

	let body = currentAvatar.getObjectByName('FemaleAvatar_Body1');
	let influences = body.morphTargetInfluences;
	let EyeShapeCount = 6;
	for (let i = 0; i < EyeShapeCount; i++) {
		influences[i] = 0;
	}
	influences[index] = 1;
};


let setEyebrowFromMorphTarget = (index, currentAvatar) => {

	let browMesh = currentAvatar.getObjectByName('Eyebrow1');

	//loop over the morph targets and set the influence to 0
	for (let i = 0; i < browMesh.morphTargetInfluences.length; i++) {
		browMesh.morphTargetInfluences[i] = 0;
	}
	// set the index to 1
	browMesh.morphTargetInfluences[index] = 1;
}

const Face = ({ currentAvatar }) => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);

	const titles = ['Hair', 'Eyebrows', 'Eyes'];

	let hairImages = [
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/hairs/hair1.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/hairs/hair2.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/hairs/hair3.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/hairs/hair4.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/hairs/hair5.png',
	];

	let eyebrowImages = [
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyebrows/eyebrow1.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyebrows/eyebrow2.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyebrows/eyebrow3.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyebrows/eyebrow4.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyebrows/eyebrow5.png',
	];

	// let eyebrowImages = [
	// 	'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow1.png',
	// 	'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow2.png',
	// 	'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow3.png',
	// 	'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow4.png',
	// 	'https://cdn.obsess-vr.com/realtime3d/skintones/Eyebrow5.png',
	// ];

	let eyeImages = [
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes/eye1.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes/eye2.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes/eye3.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes/eye4.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes/eye5.png',
		'https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes/eye6.png',
	];

	const demo_items_count = 30;

	useEffect(() => {
		getContents(selectedTone);
	}, [selectedTone]);

	const getContents = (index) => {
		let arr;
		if (index === 0) {
			arr = hairImages;
		} else if (index === 1) {
			arr = eyebrowImages;
		} else if (index === 2) {
			arr = eyeImages;
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
					temp.push(arr[i]);
					break;
			}
		}
		setDataTones([...temp]);
	};

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto">
			<div className="w-full h-full flex flex-col px-2">
				<div className="flex flex-col gap-2">
					<div className="w-full flex flex-wrap items-center justify-around">
						<img
							className={`w-[30%] h-[36px] object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 0
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							// src={hair}
							src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/hair.svg"}
							alt="HAIR"
							onClick={() => setSelectedTone(0)}
						/>
						<img
							className={`w-[30%] h-[36px] object-contain rounded px-6 py-2 cursor-pointer shadow-md ${
								selectedTone === 1
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/eyebrows.svg"}
							// src={eyelash}
							alt="EYELASH"
							onClick={() => setSelectedTone(1)}
						/>
						<img
							className={`w-[30%] h-[36px] object-contain rounded px-6 py-2 cursor-pointer shadow-md ${
								selectedTone === 2
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/eyes.svg"}
							alt="EYE"
							onClick={() => setSelectedTone(2)}
						/>
					</div>
					<ColorTone
						title={titles[selectedTone]}
						currentAvatar={currentAvatar}
						selectedTone={selectedTone}
					/>
				<div className="w-full h-fit max-h-[80%]  grid grid-cols-4 gap-1 pr-2.5 pb-2 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
						{dataTones.map((item, index) => (
							<div
								key={index}
								className="w-fit h-fit relative p-1"
							>
								{selectedStyle === index && (
									<span className="absolute top-0 right-0 w-3 h-[12px] object-contain">
										<img src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg"} alt="o" />
									</span>
								)}
								<img
									src={item}
									className={`w-[50px] sm:w-[90px] h-fit object-cover rounded p-1 cursor-pointer shadow-md bg-white ${
										selectedStyle === index &&
										'border-2 border-[#FF9F9F]'
									}`}
									alt=""
									onClick={() => {
										setSelectedStyle(index);
										if (selectedTone === 0) {
											setHairMesh(index, currentAvatar);
										} else if (selectedTone === 1) {
											setEyebrowFromMorphTarget(index, currentAvatar);
										} else if (selectedTone === 2) {
											setEyeFromMorphTarget(
												index,
												currentAvatar,
											);
										}
									}}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Face;
