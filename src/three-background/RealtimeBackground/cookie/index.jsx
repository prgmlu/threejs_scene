import React from 'react';
import { useState } from 'react';
import close from '../static/cookie/x.png';
import Switch from 'react-switch';

const Cookie = ({ handleClose }) => {
	const [isCookieSettings, setIsCookieSettings] = useState(false);
	const [isCookieManage, setIsCookieManage] = useState(false);
	const [isCookieAll, setIsCookieAll] = useState(false);

	return (
		<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] sm:w-2/5 h-fit z-50 flex flex-col py-1 px-4 gap-2 bg-white rounded-t-md">
			<img
				className="absolute top-1 right-1.5 cursor-pointer"
				src={close}
				onClick={handleClose}
			/>
			{isCookieSettings ? (
				<div className="w-full h-full flex flex-col gap-2 items-center py-1">
					<div className="w-[80%] font-sourceSansProBold text-center text-lg text-[#330D0D]">
						Cookie Settings
					</div>
					<div className="w-[80%] sm:w-[60%] flex items-center gap-2">
						<Switch
							checked={isCookieManage}
							onChange={setIsCookieManage}
							width={42}
							height={24}
							uncheckedIcon={false}
							checkedIcon={false}
							onColor="#330D0D"
							offColor="#846d6d"
						/>
						<label className="font-sourceSansProSemibold text-[#330D0D] text-sm">
							Allow essential cookies
						</label>
					</div>
					<div className="w-[80%] sm:w-[60%] flex items-center gap-2">
						<Switch
							checked={isCookieAll}
							onChange={setIsCookieAll}
							width={42}
							height={24}
							uncheckedIcon={false}
							checkedIcon={false}
							onColor="#330D0D"
							offColor="#846d6d"
						/>
						<label className="font-sourceSansProSemibold text-[#330D0D] text-sm">
							Allow necessary cookies
						</label>
					</div>
				</div>
			) : (
				<div className="text-sm font-sourceSansProRegular text-[#330D0D]">
					This website collects cookies to deliver better user
					experience.
				</div>
			)}
			<div className="flex items-center gap-2">
				<button className="w-1/2 h-fit px-2 py-1 border-2 border-[#330D0D] text-[#330D0D] text-base font-sourceSansProRegular rounded cursor-pointer">
					{isCookieSettings ? 'Allow all cookies' : 'Manage cookies'}
				</button>
				<button
					onClick={() => setIsCookieSettings(true)}
					className="w-1/2 h-fit px-2 py-1 bg-[#330D0D] text-base text-white font-sourceSansProRegular rounded cursor-pointer"
				>					{isCookieSettings
						? 'Confirm my choices'
						: 'Allow all cookies'}
				</button>
			</div>
		</div>
	);
};

export default Cookie;
