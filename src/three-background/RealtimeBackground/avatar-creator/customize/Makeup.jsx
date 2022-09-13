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

let setMakeupFromTexture = (index,currentAvatar,selectedSkintone) => {
	let ind = index +1;
	let url = `https://cdn.obsess-vr.com/realtime3d/skintone-makeup-512/Sk${selectedSkintone}_FemaleAvatar${ind}_D.png`;
	console.log(url)
	// swap the texture of the mesh
	let mesh = currentAvatar.getChildByName('FemaleAvatar_Body1').children[0];
	debugger;
	setMeshTextureImage(mesh, url);
	addRoughness(currentAvatar);
	// return;
}

let addRoughness = (currentAvatar) => {
	let roughnessTextureUrl = "https://cdn.obsess-vr.com/realtime3d/roughness/Sk_FemaleAvatar_R.png";
	let roughnessTexture = new THREE.TextureLoader().load(roughnessTextureUrl);
	let mesh = currentAvatar.getChildByName('FemaleAvatar_Body1').children[0];
	mesh.material.roughnessMap = roughnessTexture;
	mesh.material.needsUpdate = true;
}

const Makeup = ({selectedSkintone, setSelectedMakeup, currentAvatar, selectedMakeup}) => {
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
	]

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
		<div className="w-full h-full flex flex-col px-2 gap-2">
			<div className="w-full h-fit flex flex-col">
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
				<ColorTone title={titles[selectedTone]} />
				<div className="w-full h-[80%] flex flex-wrap justify-between gap-y-1 pr-2.5 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
					{dataTones.map((item, index) => (
						<div key={index} className="w-fit h-fit relative p-1">
							{selectedMakeup === index && (
								<span className="absolute top-0 right-0 w-3 h-3 object-contain">
									<img src={check} alt="o" />
								</span>
							)}
							<img
								src={item}
								className={`${
									selectedTone === 0
										? 'w-fit h-14'
										: 'w-[64px] sm:w-[72px] h-99 px-2 py-11'
								} object-contain rounded  cursor-pointer shadow-md bg-white ${
									selectedMakeup === index &&
									'border-2 border-[#FF9F9F]'
								}`}
								alt=""
								onClick={() => {setSelectedStyle(index);setSelectedMakeup(index); setMakeupFromTexture(index,currentAvatar,selectedSkintone);}}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Makeup;
