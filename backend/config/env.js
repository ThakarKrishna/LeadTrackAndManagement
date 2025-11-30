import dotenv from 'dotenv';

export const config = () => {
	const env = process.env.NODE_ENV || 'development';
	const envFile = env === 'test' ? '.env.test' : '.env';
	dotenv.config({ path: envFile });
};



