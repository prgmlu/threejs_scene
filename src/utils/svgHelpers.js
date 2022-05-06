import { DEFAULT_HOTSPOT_IMAGE } from './constants';

const getRotateString = (svgString) => {
	const matchRegex = new RegExp('rotate\\([0-9]+ [0-9]+ [0-9]+\\)');
	return svgString.match(matchRegex);
};

const extractValuesFromRotateString = (rotateString) => {
	return rotateString[0].replace('rotate(', '').replace(')', '').split(' ');
};

export const rotateSVGX = (svgString, rotateDegree) => {
	const rotateString = getRotateString(svgString);
	if (!rotateString) {
		return svgString;
	}
	const rotateValues = extractValuesFromRotateString(rotateString);
	rotateValues[0] = rotateDegree;
	svgString = svgString.replace(
		rotateString,
		`rotate(${rotateValues.join(' ')})`,
	);
	return svgString;
};

export const fetchSVGIcon = async (imageUrl) => {
	const fileData = imageUrl ? imageUrl.split('/').pop().split('.') : false;
	if (fileData && fileData[1] !== 'svg')
		console.error('Improper hotspot image format. Must be svg');

	const fileName = fileData?.[0] || 'default';
	const iconName = `hotspot-${fileName}-icon`;
	const svgUrl = imageUrl || DEFAULT_HOTSPOT_IMAGE;

	let svgFile = sessionStorage.getItem(iconName);
	if (svgFile) return svgFile;
	else {
		return fetch(svgUrl)
			.then((response) => {
				if (response.status === 200) return response.text();
				throw new Error('svg load error!');
			})
			.then((res) => {
				sessionStorage.setItem(iconName, res);
				return res;
			})
			.catch((error) => Promise.reject(error));
	}
};
