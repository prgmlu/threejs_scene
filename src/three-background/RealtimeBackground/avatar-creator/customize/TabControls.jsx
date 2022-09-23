import React from 'react';
import cloth from '../../static/avatar/menus/clothes.png';
import body from '../../static/avatar/menus/body.png';
import skin from '../../static/avatar/menus/skin.png';
import makeup from '../../static/avatar/menus/makeup.png';

const TabControls = ({ activeTab, onTabClick }) => {
	return (
		<div className="w-full items-center h-[8%] sm:h-[12%]  flex items-start justify-center gap-3 lg:gap-6">
			<div
				className={
					'w-[18%] min-w-[3rem] min-h-[3rem] h-[70%] rounded-md flex relative justify-center items-center py-1.5 px-1.5 bg-white'
				}
			>
				<img
					// src={body}
					src={'https://cdn.obsess-vr.com/realtime3d/ct_ui/body.svg'}
					alt="Body type"
					className={'w-[30%] max-h-full'}
					id="1"
					// className={`w-[20%] ${
					// 	activeTab === 1
					// 		? 'h-full pb-3 pt-3 sm:pb-3.5 px-1.5 sm:px-2.5'
					// 		: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
					// } pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
					onClick={() => onTabClick(1)}
				/>
				<div className={`absolute bg-white bottom-[-44%]  left-0 w-full h-[60%] ${activeTab === 1 ? '' : 'hidden'}`}></div>
			</div>
			<div
				className={
					'min-w-[3rem] min-h-[3rem] w-[18%] h-[70%] rounded-md flex justify-center relative items-center py-1 px-1.5 bg-white'
				}
			>
				<img
					// src={skin}
					src={'https://cdn.obsess-vr.com/realtime3d/ct_ui/face.svg'}
					alt="Skin tone"
					id="2"
					className={'w-[35%] max-h-full'}
					// className={`w-[30%] ${
					// 	activeTab === 2
					// 		? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
					// 		: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
					// } pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
					onClick={() => onTabClick(2)}
				/>
				<div className={`absolute bg-white bottom-[-44%] left-0 w-full h-[60%] ${activeTab === 2 ? '' : 'hidden'}`}></div>

			</div>

			<div
				className={
					'w-[18%] h-[70%] rounded-md min-w-[3rem] min-h-[3rem] flex justify-center relative items-center py-1 px-1.5 bg-white'
				}
			>
				<img
					src={makeup}
					// src={"https://cdn.obsess-vr.com/realtime3d/ct_ui/makeup.svg"}
					alt="Makeup"
					id="2"
					className={'w-[35%] max-h-full'}
					// className={`w-[13%] ${
					// 	activeTab === 3
					// 		? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
					// 		: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
					// } pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
					onClick={() => onTabClick(3)}
				/>
				<div className={`absolute bg-white bottom-[-44%] left-0 w-full h-[60%] ${activeTab === 3 ? '' : 'hidden'}`}></div>

			</div>
			<div
				className={
					'w-[18%] h-[70%] rounded-md flex justify-center relative min-w-[3rem] min-h-[3rem] items-center py-1 px-1.5 bg-white'
				}
			>
				<img
					// src={cloth}
					src={
						'https://cdn.obsess-vr.com/realtime3d/ct_ui/outfit.svg'
					}
					alt="Outfit"
					id="3"
					className={'w-[35%] max-h-full'}
					// className={`w-[13%] ${
					// 	activeTab === 4
					// 		? 'h-full pb-1.5 sm:pb-3.5 px-1.5 sm:px-2.5'
					// 		: 'h-[80%] pb-1 sm:pb-2 px-1 sm:px-2'
					// } pt-2 object-contain rounded-t-md flex justify-center cursor-pointer bg-white`}
					onClick={() => onTabClick(4)}
				/>
				<div className={`absolute bg-white bottom-[-44%] left-0 w-full h-[60%] ${activeTab === 4 ? '' : 'hidden'}`}></div>

			</div>
		</div>
	);
};

export default TabControls;
