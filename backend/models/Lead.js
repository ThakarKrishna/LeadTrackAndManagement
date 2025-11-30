import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
	formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true, index: true },
	websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true, index: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
	data: { type: Object, default: {} },
	submittedAt: { type: Date, default: Date.now }
});

export const Lead = mongoose.model('Lead', leadSchema);



