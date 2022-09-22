import React from 'react';
import { useState } from 'react';
import SkinTone from './SkinTone';
import check from '../../static/avatar/menus/check.png';
const FEMALE_SHAPE = 'https://cdn.obsess-vr.com/realtime3d/ct_ui/feminine.svg';
const MALE_SHAPE = 'https://cdn.obsess-vr.com/realtime3d/ct_ui/masculine.svg';

const BodyShape = ({
	currentAvatar,
	selectedBodyshape,
	setSelectedBodyshape,
	selectedMakeup,
	setSelectedSkintone,
	setSkintonXY,
	skintoneX,
	skintoneY,
}) => {
	// const [selectedIndex, setSelectedIndex] = useState({ x: skinToneX || 0, y: skinToneY || 0 });
	let counter = 0;

	let bodyMesh = currentAvatar.getChildByName('FemaleAvatar_Body1');

	const tones = [
		['#F2D3CE', '#E0B0A6', '#C68D82', '#A36B60', '#7B4B41', '#502E2C'],
		['#EAC2B9', '#CE9E8F', '#B27F6A', '#8E5D4E', '#643E31'],
		['#EFD5C8', '#DCB3A1', '#BF9077', '#9D6F55', '#754F38', '#4B3124'],
		['#E4C8B2', '#CBA487', '#AA8163', '#876144', '#5D412B'],
		['#EDD8C7', '#D5B69A', '#B99573', '#93724F', '#715236', '#483320'],
		['#E0C8B0', '#C5A57F', '#A5855E', '#81633D', '#594426'],
	];

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto gap-2">
			<div className="h-fit font-sourceSansProSemibold text-lg pb-2">
				Body Shape
			</div>
			<div className="h-fit flex flex-wrap gap-x-6 gap-y-1">
				<div
					onClick={() => {
						window.maleModel.visible = false;
						window.femaleModel.visible = true;
						setSelectedBodyshape('female');
					}}
					className={`w-fit h-fit px-3 relative cursor-pointer rounded-[4px] shadow-md ${
						selectedBodyshape === 'female'
							? 'border-[2px] border-[#FF9F9F]'
							: 'border-transparent'
					}`}
				>
					{selectedBodyshape === 'female' && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img
								src={
									'https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg'
								}
								alt="o"
							/>
						</span>
					)}
					<img
						className="min-h-fit h-fit scale-75"
						src={FEMALE_SHAPE}
						alt=""
						onClick={() => {
							window.maleModel.visible = false;
							window.femaleModel.visible = true;
							setSelectedBodyshape('female');
						}}
					/>
				</div>
				<div
					onClick={() => {
						window.femaleModel.visible = false;
						window.maleModel.visible = true;
						setSelectedBodyshape('male');
					}}
					className={`w-fit h-fit px-3 relative cursor-pointer rounded-[4px] shadow-md ${
						selectedBodyshape === 'male'
							? 'border-[2px] border-[#FF9F9F]'
							: 'border-transparent'
					}`}
				>
					{selectedBodyshape === 'male' && (
						<span className="absolute -top-1.5 -right-1.5 w-4 h-4 object-contain">
							<img
								src={
									'https://cdn.obsess-vr.com/realtime3d/ct_ui/check.svg'
								}
								alt="o"
							/>
						</span>
					)}
					<img
						className="min-h-fit h-fit scale-75"
						src={MALE_SHAPE}
						alt=""
						onClick={() => {
							window.femaleModel.visible = false;
							window.maleModel.visible = true;
							setSelectedBodyshape('male');
						}}
					/>
				</div>
			</div>
			<div className="font-sourceSansProSemibold text-lg">Skin Tone</div>
			<div className="w-full h-fit max-h-[60%] flex flex-col px-1.5 gap-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
				{tones.map((group, index) => (
					<div
						key={index}
						className={`flex flex-wrap items-center justify-between  ${
							index % 2 === 0 ? 'px-2' : 'px-10'
						}`}
					>
						{group.map((t, idx) => {
							counter++;
							return (
								<SkinTone
									mesh={bodyMesh}
									key={counter}
									counter={counter}
									color={t}
									x={index}
									y={idx}
									selectedMakeup={selectedMakeup}
									// selectedIndex={selectedIndex}
									skintoneX={skintoneX}
									skintoneY={skintoneY}
									setSelectedIndex={setSkintonXY}
									setSelectedSkintone={setSelectedSkintone}
								/>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default BodyShape;
