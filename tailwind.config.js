/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,jsx}"],
	theme: {
		extend: {
			boxShadow: {
				custom: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;",
			},
		},
	},
	plugins: [],
};
