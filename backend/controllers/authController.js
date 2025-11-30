import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const signup = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
	const existing = await User.findOne({ email });
	if (existing) return res.status(400).json({ message: 'Email already in use' });
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const user = await User.create({ name, email, password: hash });
	const token = generateToken(user._id);
	return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
	const user = await User.findOne({ email });
	if (!user) return res.status(400).json({ message: 'Invalid credentials' });
	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(400).json({ message: 'Invalid credentials' });
	const token = generateToken(user._id);
	return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});



