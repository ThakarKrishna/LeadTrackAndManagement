import { asyncHandler } from '../utils/asyncHandler.js';
import { Form } from '../models/Form.js';
import { Website } from '../models/Website.js';
import { Lead } from '../models/Lead.js';

// Public endpoint: capture leads
export const captureLead = asyncHandler(async (req, res) => {
	const { formId } = req.params;
	const form = await Form.findById(formId);
	if (!form) return res.status(404).json({ message: 'Form not found' });
	const website = await Website.findById(form.websiteId);
	if (!website) return res.status(404).json({ message: 'Website not found' });
	const userId = website.userId;
	const payload = req.body && req.body.data ? req.body.data : req.body || {};
	const lead = await Lead.create({
		formId: form._id,
		websiteId: website._id,
		userId,
		data: payload,
		submittedAt: new Date()
	});
	res.status(201).json({ success: true, id: lead._id });
});

// Auth: list leads with filters
export const listLeads = asyncHandler(async (req, res) => {
	const { websiteId, formId, startDate, endDate, page = 1, limit = 20 } = req.query;
	// only leads belonging to current user
	const websiteIds = (await Website.find({ userId: req.user.id })).map(w => w._id.toString());
	const query = { userId: req.user.id };
	if (websiteId) {
		if (!websiteIds.includes(websiteId)) return res.status(403).json({ message: 'Forbidden' });
		query.websiteId = websiteId;
	} else {
		query.websiteId = { $in: websiteIds };
	}
	if (formId) query.formId = formId;
	if (startDate || endDate) {
		query.submittedAt = {};
		if (startDate) query.submittedAt.$gte = new Date(startDate);
		if (endDate) query.submittedAt.$lte = new Date(endDate);
	}
	const skip = (Number(page) - 1) * Number(limit);
	const [items, total] = await Promise.all([
		Lead.find(query).sort({ submittedAt: -1 }).skip(skip).limit(Number(limit)),
		Lead.countDocuments(query)
	]);
	res.json({ items, total, page: Number(page), limit: Number(limit) });
});



