import React, { useState, useEffect } from 'react';
import ColorTone from '../ColorTone';

import hair from '../../static/avatar/menus/hair_short.png';
import eyelash from '../../static/avatar/menus/eyelash.png';
import eye from '../../static/avatar/menus/eye.png';
import check from '../../static/avatar/menus/check.png';
import d_eyelash from '../../static/avatar/demo/demo_eyelashes.png';
import d_eye from '../../static/avatar/demo/demo_eyes.png';
import d_face from '../../static/avatar/demo/demo_face.png';
import { setMeshTextureImage } from '../../../../three-controls/OutfitTranslator';

let setMakeupFromTexture = (index, currentAvatar, selectedSkintone) => {
	let ind = index + 1;
	let url = `https://cdn.obsess-vr.com/realtime3d/skintone-makeup-512/Sk${selectedSkintone}_FemaleAvatar${ind}_D.png`;
	console.log(url);
	// swap the texture of the mesh
	let mesh = currentAvatar.getChildByName('FemaleAvatar_Body1').children[0];
	debugger;
	setMeshTextureImage(mesh, url);
	// return;
};

const Makeup = ({
	selectedSkintone,
	setSelectedMakeup,
	currentAvatar,
	selectedMakeup,
}) => {
	const [selectedStyle, setSelectedStyle] = useState(0);
	const [dataTones, setDataTones] = useState([]);
	const [selectedTone, setSelectedTone] = useState(0);
	const titles = ['Makeup', 'Eyebrows', 'Eyes'];
	const demo_items_count = 30;

	let makeupImages = [
		'https://cdn.obsess-vr.com/realtime3d/placeholders/Makeup1.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/Makeup2.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/Makeup3.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/Makeup4.png',
		'https://cdn.obsess-vr.com/realtime3d/placeholders/Makeup5.png',
	];

	useEffect(() => {
		getContents(selectedTone);
	}, [selectedTone]);

	const getContents = (index) => {
		let temp = [];
		for (let i = 0; i < makeupImages.length; i++) {
			switch (index) {
				case 0:
					temp.push(makeupImages[i]);
					break;
				case 1:
					temp.push(makeupImages[i]);
					break;
				case 2:
					temp.push(makeupImages[i]);
					break;
			}
		}
		setDataTones([...temp]);
	};

	return (
<<<<<<< HEAD
		<div className="w-full h-full flex flex-col">
			<div className="w-full h-full flex flex-col px-2">
				<div className="flex flex-col gap-2">
					<div className="w-full flex flex-wrap items-center justify-around">
=======
		<div className="w-full h-full flex flex-col px-2 gap-2">
			<div className="w-full h-fit flex flex-col">
				<div className="w-full flex flex-wrap items-center justify-between">
>>>>>>> 7b06d74b13952e945fecca5094e2b26aea0e0b0c
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-[36px] object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 0
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={hair}
							alt="HAIR"
							onClick={() => setSelectedTone(0)}
						/>
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-[36px] object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 1
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eyelash}
							alt="EYELASH"
							onClick={() => setSelectedTone(1)}
						/>
						<img
							className={`w-24 sm:w-[70px] md:w-[27%] h-[36px] object-contain rounded px-4 py-2 cursor-pointer shadow-md ${
								selectedTone === 2
									? 'bg-white border-[1.5px] border-black'
									: 'bg-white/50'
							}`}
							src={eye}
							alt="EYE"
							onClick={() => setSelectedTone(2)}
						/>
				</div>
				<ColorTone title={titles[selectedTone]} />
<<<<<<< HEAD
				<div className="w-full h-fit max-h-[80%] flex flex-wrap justify-between gap-y-1 px-1 pb-2 sm:my-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
=======
				<div className="w-full h-[80%] flex flex-wrap justify-between gap-y-1 pr-2.5 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
>>>>>>> 7b06d74b13952e945fecca5094e2b26aea0e0b0c
					{dataTones.map((item, index) => (
						<div key={index} className="w-fit h-fit relative p-1">
							{selectedMakeup === index && (
								<span className="absolute top-0 right-0 w-3 h-3 object-contain">
									<img src={check} alt="o" />
								</span>
							)}
							<img
								src={item}
								className={`w-[64px] h-fit object-contain rounded p-1 cursor-pointer shadow-md bg-white ${
									selectedMakeup === index &&
									'border-2 border-[#FF9F9F]'
								}`}
								alt=""
								onClick={() => {
									setSelectedStyle(index);
									setSelectedMakeup(index);
									setMakeupFromTexture(
										index,
										currentAvatar,
										selectedSkintone,
									);
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Makeup;
