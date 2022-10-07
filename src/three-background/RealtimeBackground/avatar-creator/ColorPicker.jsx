import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import close from '../static/avatar/menus/close.png';

const ColorPicker = ({ selectedColor, handlePicker, handleClose }) => {
	const [showColor, setShowColor] = useState(false);
	const colorArr = [
		['#88582F', '#C89559', '#C9A57B', '#E9D6BC'],
		['#551A05', '#7D2F17', '#D88050'],
		['#291401', '#422207', '#633209', '#78461C'],
		['#050407', '#9D8E80', '#C3BCBA'],
	];
	const switchView = (x) => {
		setShowColor(x);
	};
	return (
		<div className="absolute top-[130%] right-[0%] w-fit h-fit z-40 bg-gray-100 rounded-md">
			<img
				onClick={() => handleClose(false)}
				className="absolute z-50 w-6 h-6 -top-1.5 -right-1.5 cursor-pointer"
				src={close}
				alt="CLOSE"
			/>
			<div className="flex justify-center align-center h-[40px] mb-4 ">
				<button
					onClick={() => {
						switchView(false);
					}}
					className={`text-sm font-medium color-[#330D0D] py-2 px-3 w-1/2 rounded-md transition-200 ${
						!showColor ? 'border-r border-b border-t-0 border-l-0 border-solid border-[#330D0D] bg-[#330D0D] bg-opacity-20' : 'bg-white'
					}`}
				>
					 Swatches 
				</button>
				<button
					onClick={() => {
						switchView(true);
					}}
					className={`text-sm font-medium w-1/2 color-[#330D0D] rounded-md transition-200 ${
						!showColor ? 'bg-white' : 'border-l border-b border-r-0 border-t-0 border-solid border-[#330D0D] bg-[#330D0D] bg-opacity-20'
					}`}
				>
					Custom
				</button>
			</div>
			<div className="p-3">
			{showColor && (
				<HexColorPicker
					color={selectedColor}
					onChange={(color) => handlePicker(color)}
				/>
			)}
			{!showColor && (
				<div className="flex py-2 justify-between flex-column column w-[200px] h-[200px]">
					{colorArr.map((group, i) => {
						return (
							<div
								className="flex flex-nowrap justify-center gap-[10px]"
								key={i}
							>
								{group.map((color, index) => {
									return (
										<button
											key={index}
											style={{
												backgroundColor: color,
												border:
													selectedColor == color
														? '2px solid #FF9F9F'
														: 'none',
											}}
											className="w-[37px] h-[37px] rounded-full"
											// onClick={handlePicker(color)}
										></button>
									);
								})}
							</div>
						);
					})}
				</div>
			)}
			</div>
		</div>
	);
};

export default ColorPicker;
