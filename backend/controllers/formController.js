import { asyncHandler } from '../utils/asyncHandler.js';
import { Website } from '../models/Website.js';
import { Form } from '../models/Form.js';
import { detectFormsOnUrl, extractFieldsFromSingleUrl } from '../services/formDetectionService.js';

export const autoDetectForms = asyncHandler(async (req, res) => {
	const { websiteId } = req.params;
	const website = await Website.findOne({ _id: websiteId, userId: req.user.id });
	if (!website) return res.status(404).json({ message: 'Website not found' });
	const formsDetected = await detectFormsOnUrl(website.url);
	// Save forms; avoid duplicates (formUrl + websiteId)
	const created = [];
	for (const f of formsDetected) {
		if (!f.fields || f.fields.length === 0) continue;
		const exists = await Form.findOne({ websiteId: website._id, formUrl: f.formUrl });
		if (exists) {
			created.push(exists);
			continue;
		}
		const form = await Form.create({ websiteId: website._id, formUrl: f.formUrl, fields: f.fields });
		created.push(form);
	}
	res.json({ count: created.length, forms: created });
});

export const extractPreview = asyncHandler(async (req, res) => {
	const { formUrl } = req.body;
	if (!formUrl) return res.status(400).json({ message: 'formUrl is required' });
	const forms = await extractFieldsFromSingleUrl(formUrl);
	res.json({ forms });
});

export const createForm = asyncHandler(async (req, res) => {
	const { websiteId, formUrl, fields } = req.body;
	if (!websiteId || !formUrl || !fields || !Array.isArray(fields)) {
		return res.status(400).json({ message: 'websiteId, formUrl and fields are required' });
	}
	const website = await Website.findOne({ _id: websiteId, userId: req.user.id });
	if (!website) return res.status(404).json({ message: 'Website not found' });
	const form = await Form.create({ websiteId: website._id, formUrl, fields });
	res.status(201).json(form);
});

export const listForms = asyncHandler(async (req, res) => {
	const { websiteId } = req.query;
	const query = {};
	if (websiteId) query.websiteId = websiteId;
	const websiteIds = (await Website.find({ userId: req.user.id })).map(w => w._id);
	query.websiteId = query.websiteId || { $in: websiteIds };
	const forms = await Form.find(query).sort({ createdAt: -1 });
	res.json(forms);
});

export const deleteForm = asyncHandler(async (req, res) => {
	const { id } = req.params;
	// Ensure form belongs to user's website
	const form = await Form.findById(id);
	if (!form) return res.status(404).json({ message: 'Form not found' });
	const website = await Website.findOne({ _id: form.websiteId, userId: req.user.id });
	if (!website) return res.status(403).json({ message: 'Forbidden' });
	await form.deleteOne();
	res.json({ success: true });
});



