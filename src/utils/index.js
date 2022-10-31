export * from './imageHotspotHelpers';
export * from './hotspotHelpers';

export const formatDate = (date, format) => {
	const map = {
		mm: date.getMonth() + 1,
		dd: date.getDate(),
		yy: date.getFullYear().toString().slice(-2),
		hh: date.getHours().toString(),
		yyyy: date.getFullYear(),
	};

	return format.replace(/mm|dd|hh|yy|yyy/gi, (matched) => map[matched]);
};

export const generateRandomString = (length = 10) => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return result;
};
