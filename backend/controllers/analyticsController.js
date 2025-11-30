import { asyncHandler } from '../utils/asyncHandler.js';
import { Lead } from '../models/Lead.js';
import { Website } from '../models/Website.js';
import mongoose from 'mongoose';

export const leadsPerDay = asyncHandler(async (req, res) => {
	const websiteIds = (await Website.find({ userId: req.user.id })).map(w => w._id);
	const data = await Lead.aggregate([
		{ $match: { userId: new mongoose.Types.ObjectId(req.user.id), websiteId: { $in: websiteIds } } },
		{
			$group: {
				_id: {
					$dateToString: { format: '%Y-%m-%d', date: '$submittedAt' }
				},
				count: { $sum: 1 }
			}
		},
		{ $sort: { _id: 1 } }
	]);
	res.json(data.map(d => ({ date: d._id, count: d.count })));
});

export const leadsPerForm = asyncHandler(async (req, res) => {
	const websiteIds = (await Website.find({ userId: req.user.id })).map(w => w._id);
	const data = await Lead.aggregate([
		{ $match: { userId: new mongoose.Types.ObjectId(req.user.id), websiteId: { $in: websiteIds } } },
		{
			$group: {
				_id: '$formId',
				count: { $sum: 1 }
			}
		},
		{ $sort: { count: -1 } },
		{ $limit: 20 }
	]);
	res.json(data);
});



