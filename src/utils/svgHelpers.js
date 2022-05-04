const getRotateString = (svgString) => {
	const matchRegex = new RegExp('rotate\\([0-9]+ [0-9]+ [0-9]+\\)');
	return svgString.match(matchRegex);
};

const extractValuesFromRotateString = (rotateString) => {
	return rotateString[0].replace('rotate(', '').replace(')', '').split(' ');
};

export const rotateSVGX = (svgString, rotateDegree) => {
	const rotateString = getRotateString(svgString);
	const rotateValues = extractValuesFromRotateString(rotateString);
	rotateValues[0] = rotateDegree;
	svgString = svgString.replace(
		rotateString,
		`rotate(${rotateValues.join(' ')})`,
	);
	return svgString;
};
