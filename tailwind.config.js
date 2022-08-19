/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{jsx,js}'],
	theme: {
		extend: {
			fontFamily: {
				sourceSansProLight: ['Source Sans Pro Light'],
				sourceSansProRegular: ['Source Sans Pro Regular'],
				sourceSansProSemibold: ['Source Sans Pro Semibold'],
				sourceSansProBold: ['Source Sans Pro Bold'],
			},
		},
	},
	plugins: [require('tailwind-scrollbar')],
};
