import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) {
		return res.status(401).json({ message: 'Not authorized' });
	}
	try {
		const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
		const decoded = jwt.verify(token, secret);
		req.user = { id: decoded.id };
		return next();
	} catch (e) {
		return res.status(401).json({ message: 'Invalid token' });
	}
};



