import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
	name: { type: String, required: true },
	type: { type: String, required: true }
}, { _id: false });

const formSchema = new mongoose.Schema({
	websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true, index: true },
	formUrl: { type: String, required: true },
	fields: { type: [fieldSchema], default: [] },
	createdAt: { type: Date, default: Date.now }
});

export const Form = mongoose.model('Form', formSchema);



