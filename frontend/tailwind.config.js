/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				background: 'hsl(0 0% 100%)',
				foreground: 'hsl(240 10% 4%)',
				card: 'hsl(0 0% 100%)',
				popover: 'hsl(0 0% 100%)',
				muted: 'hsl(240 4.8% 95.9%)',
				border: 'hsl(240 5.9% 90%)',
				input: 'hsl(240 5.9% 90%)',
				primary: {
					DEFAULT: 'hsl(222.2 47.4% 11.2%)',
					foreground: 'hsl(210 40% 98%)'
				},
				secondary: {
					DEFAULT: 'hsl(210 40% 96.1%)',
					foreground: 'hsl(222.2 47.4% 11.2%)'
				},
				accent: {
					DEFAULT: 'hsl(210 40% 96.1%)',
					foreground: 'hsl(222.2 47.4% 11.2%)'
				},
				destructive: {
					DEFAULT: 'hsl(0 84.2% 60.2%)',
					foreground: 'hsl(210 40% 98%)'
				}
			},
			borderRadius: {
				lg: '0.5rem',
				md: 'calc(0.5rem - 2px)',
				sm: 'calc(0.5rem - 4px)'
			}
		}
	},
	plugins: []
};



