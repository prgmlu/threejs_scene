import React from 'react';
import { useState } from 'react';
import SkinTone from './SkinTone';
import check from '../../static/avatar/menus/check.png';
import FEMALE_SHAPE from '../../../../three-background/RealtimeBackground/static/avatar/shapes/feminine.png';
import MALE_SHAPE from '../../../../three-background/RealtimeBackground/static/avatar/shapes/masculine.png';

const BodyShape = ({
	currentAvatar,
	maleAvatar,
	femaleAvatar,
	selectedBodyshape,
	setSelectedBodyshape,
	selectedMakeup,
	setSelectedSkintone,
	setSkintonXY,
	skintoneX,
	skintoneY,
	visibleGenderRef,
	femaleLocalAvatarOutfitStringRef,
	maleLocalAvatarOutfitStringRef,
}) => {
	// const [selectedIndex, setSelectedIndex] = useState({ x: skinToneX || 0, y: skinToneY || 0 });
	let counter = 0;

	let bodyMesh = currentAvatar.getObjectByName('FemaleAvatar_Head');

	const tones = [
		['#F2D3CE', '#E0B0A6', '#C68D82', '#A36B60', '#7B4B41', '#502E2C'],
		['#EAC2B9', '#CE9E8F', '#B27F6A', '#8E5D4E', '#643E31'],
		['#EFD5C8', '#DCB3A1', '#BF9077', '#9D6F55', '#754F38', '#4B3124'],
		['#E4C8B2', '#CBA487', '#AA8163', '#876144', '#5D412B'],
		['#EDD8C7', '#D5B69A', '#B99573', '#93724F', '#715236', '#483320'],
		['#E0C8B0', '#C5A57F', '#A5855E', '#81633D', '#594426A86B48']
	];
	const newTones = [
		'#FBEBD7',
		'#F7D5AF',
		'#E4A57F',
		'#A86B48',
		'#633F2F',
		'#F8D8C3',
		'#F4CEAA',
		'#D3A271',
		'#C3774B',
		'#794E3A',
		'#E0C7B3',
		'#E7C5A0',
		'#F3B989',
		'#C28154',
		'#946048',
	];

	return (
		<div className="w-full h-full flex flex-col justify-between overflow-y-auto">
			<div className="h-fit font-sourceSansProSemibold text-lg pb-2">
				Body Shape
			</div>
			<div className="min-h-[35%] max-h-[35%] flex flex-wrap gap-x-6 gap-y-1">
				<div
					onClick={() => {
						maleAvatar.visible = false;
						femaleAvatar.visible = true;
						visibleGenderRef.current = 'female';
						setSelectedBodyshape('female');
					}}
					className={`flex justify-center w-[25%] h-[100%] max-h-[8rem] max-w-[6rem] px-3 relative cursor-pointer rounded-[4px] shadow-md ${
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
						className="min-h-full h-full scale-75"
						src={FEMALE_SHAPE}
						alt=""
						onClick={() => {
							maleAvatar.visible = false;
							femaleAvatar.visible = true;
							visibleGenderRef.current = 'female';
							setSelectedBodyshape('female');
						}}
					/>
				</div>
				<div
					onClick={() => {
						femaleAvatar.visible = false;
						maleAvatar.visible = true;
						visibleGenderRef.current = 'male';
						setSelectedBodyshape('male');
					}}
					className={` flex justify-center  w-[25%] h-[100%] h-full px-3 max-h-[8rem] max-w-[6rem] relative cursor-pointer rounded-[4px] shadow-md ${
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
						className="min-h-full h-full scale-75"
						src={MALE_SHAPE}
						alt=""
						onClick={() => {
							femaleAvatar.visible = false;
							maleAvatar.visible = true;
							visibleGenderRef.current = 'male';
							setSelectedBodyshape('male');
						}}
					/>
				</div>
				
			</div>
			<div className="font-sourceSansProSemibold text-lg py-3">
				Skin Color
			</div>
			<div className=" w-full h-full flex flex-wrap wrap pb-[1rem] gap-[1rem] sm:gap-2 md:gap-3 lg:gap-4 overflow-y-auto justify-center md:px-2">
				{/* {tones.map((group, index) => (
					<div
						key={index}
						className={`flex flex-nowrap sm:mb-1.5 mx-auto w-[80%] md:w-full items-center justify-between  ${
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
										setSelectedSkintone={
											setSelectedSkintone
										}
										visibleGenderRef={visibleGenderRef}
										femaleLocalAvatarOutfitStringRef={
											femaleLocalAvatarOutfitStringRef
										}
										maleLocalAvatarOutfitStringRef={
											maleLocalAvatarOutfitStringRef
										}
									/>
							);
						})}
					</div>
				))} */}
				{newTones.map((x, index) => {
					counter++;
					return (
						<>
						<SkinTone
							mesh={bodyMesh}
							key={counter}
							counter={counter}
							color={x}
							x={index}
							y={index}
							selectedMakeup={selectedMakeup}
							// selectedIndex={selectedIndex}
							skintoneX={skintoneX}
							skintoneY={skintoneY}
							setSelectedIndex={setSkintonXY}
							setSelectedSkintone={setSelectedSkintone}
							visibleGenderRef={visibleGenderRef}
							femaleLocalAvatarOutfitStringRef={
								femaleLocalAvatarOutfitStringRef
							}
							maleLocalAvatarOutfitStringRef={
								maleLocalAvatarOutfitStringRef
							}
						/>
					</>
					);
				})}
			</div>
		</div>
	);
};

export default BodyShape;
