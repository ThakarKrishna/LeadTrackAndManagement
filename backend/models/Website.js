import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	url: { type: String, required: true },
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

export const Website = mongoose.model('Website', websiteSchema);



