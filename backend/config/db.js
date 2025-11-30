import mongoose from 'mongoose';

export const connectDB = async () => {
	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead_tracking';
	mongoose.set('strictQuery', true);
	await mongoose.connect(uri, {
		autoIndex: true
	});
	// eslint-disable-next-line no-console
	console.log('MongoDB connected');
};



