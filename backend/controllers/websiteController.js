import { asyncHandler } from '../utils/asyncHandler.js';
import { Website } from '../models/Website.js';

export const createWebsite = asyncHandler(async (req, res) => {
	const { url, name } = req.body;
	if (!url || !name) return res.status(400).json({ message: 'Name and URL are required' });
	const website = await Website.create({ userId: req.user.id, url, name });
	res.status(201).json(website);
});

export const listWebsites = asyncHandler(async (req, res) => {
	const websites = await Website.find({ userId: req.user.id }).sort({ createdAt: -1 });
	res.json(websites);
});

export const updateWebsite = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { url, name } = req.body;
	const website = await Website.findOneAndUpdate({ _id: id, userId: req.user.id }, { url, name }, { new: true });
	if (!website) return res.status(404).json({ message: 'Website not found' });
	res.json(website);
});

export const deleteWebsite = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const website = await Website.findOneAndDelete({ _id: id, userId: req.user.id });
	if (!website) return res.status(404).json({ message: 'Website not found' });
	res.json({ success: true });
});



