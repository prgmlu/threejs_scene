import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import close from '../static/avatar/menus/close.png';
import "./CustomStyles/ColorPicker.css"

const ColorPicker = ({ selectedColor,tabName, handlePicker, handleClose }) => {
	const [showColor, setShowColor] = useState(false);
	const colorArr = [
		['#88582F', '#C89559', '#C9A57B', '#E9D6BC'],
		['#551A05', '#7D2F17', '#D88050'],
		['#291401', '#422207', '#633209', '#78461C'],
		['#050407', '#9D8E80', '#C3BCBA'],
	];
	const colorArr2 = [
		['#271F1D', '#894D31', '#397EDD', '#A18C39'],
		['#907155', '#3C792B', '#64777B'], 
	];
	const switchView = (x) => {
		setShowColor(x);
	};
	return (
		<div className="absolute top-[-15%] md:top-[10%] w-fit max-w-[80%] shadow-[0px_3px_8px_3px_rgba(0,0,0,0.25)] left-[50%] md:left-[unset] md:right-[-5%] translate-x-[-50%] md:translate-x-[0px] h-[310px] w-[285px] w-fit h-fit z-40 bg-white rounded-md">
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
					className={`text-sm border-solid border-r border-b border-t-0 border-l-0 font-medium color-[#330D0D] py-2 px-3 w-1/2 transition-200 rounded-br-[6px] ${
						showColor ? '  border-[#330D0D] bg-[#f5f3f3] ' : 'bg-white border-white'
					}`}
				>
					 Swatches 
				</button>
				<button
					onClick={() => {
						switchView(true);
					}}
					className={`text-sm font-medium border-l border-b border-r-0 border-t-0 border-solid rounded-bl-[6px] w-1/2 color-[#330D0D] border-bl-[6px] transition-200 ${
						showColor ? 'bg-white border-white' : 'border-[#330D0D] bg-[#f5f3f3] '
					}`}
				>
					Custom
				</button>
			</div>
			<div className="px-3 pb-2 min-h-[235px] flex justify-between align-center align-items-center ">
			{showColor && (
				<HexColorPicker style={{height: "215px", width: "250px", marginLeft: '1.75rem', marginRight: 'auto'}}
					color={selectedColor}
					onChange={(color) => handlePicker(color)}
				/>
			)}
			{!showColor && tabName != "Eyes" && (
				<div className="flex justify-between flex-column mx-auto column w-fit h-fit">
					{colorArr.map((group, i) => {
						return (
							<div
								className="flex mb-2 flex-nowrap justify-center gap-[10px]"
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
											className="w-[50px] h-[50px] rounded-full"
											// onClick={handlePicker(color)} 
										></button>
									);
								})}
							</div>
						);
					})}
				</div>
			)}
			{!showColor && tabName == "Eyes" && (
				<div className="flex py-2 justify-center mx-auto gap-[1rem] flex-column gap-3 column w-fit h-fit">
					{colorArr2.map((group, i) => {
						return (
							<div
								className="flex flex-nowrap mb-2 justify-center gap-[10px]"
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
											className="w-[50px] h-[50px] rounded-full"
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
